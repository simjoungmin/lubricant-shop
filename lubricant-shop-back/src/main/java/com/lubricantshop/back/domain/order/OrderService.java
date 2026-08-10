package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.order.dto.OrderCreateRequest;
import com.lubricantshop.back.domain.order.dto.OrderCreateResponse;
import com.lubricantshop.back.domain.order.dto.OrderItemRequest;
import com.lubricantshop.back.domain.order.dto.OrderPaymentCompleteResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderDetailResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderItemResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderSummaryResponse;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductRepository;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;

    public OrderService(
            MemberRepository memberRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository
    ) {
        this.memberRepository = memberRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public OrderCreateResponse createOrder(Long memberId, OrderCreateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        List<OrderLine> orderLines = resolveOrderLines(request.items());
        BigDecimal totalOrderAmount = orderLines.stream()
                .map(OrderLine::totalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int pointEarned = orderLines.stream()
                .mapToInt(OrderLine::pointEarned)
                .sum();
        int pointUsed = resolvePointUsed(member, request, totalOrderAmount);
        BigDecimal paymentAmount = totalOrderAmount.subtract(BigDecimal.valueOf(pointUsed));

        Order order = orderRepository.save(new Order(
                member,
                totalOrderAmount,
                request.shippingAddress().trim(),
                request.paymentMethod(),
                paymentAmount,
                pointUsed,
                pointEarned,
                request.receiverName().trim(),
                request.receiverPhone().trim(),
                trimToNull(request.deliveryRequest())
        ));

        List<OrderItem> orderItems = orderLines.stream()
                .map(line -> new OrderItem(order, line.product(), line.quantity(), line.pointEarned()))
                .toList();
        orderItemRepository.saveAll(orderItems);
        cartRepository.deleteByMember_MemberId(memberId);

        return new OrderCreateResponse(
                order.getOrderId(),
                toOrderNumber(order.getOrderId()),
                order.getTotalOrderAmount(),
                order.getPaymentAmount(),
                request.usePoints(),
                order.getPointUsed(),
                order.getPointEarned(),
                member.getPointBalance(),
                order.getOrderStatus().name()
        );
    }

    @Transactional
    public OrderPaymentCompleteResponse completeTestPayment(Long memberId, Long orderId) {
        Order order = orderRepository.findByOrderIdAndMember_MemberId(orderId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        if (order.getOrderStatus() == OrderStatus.PAID) {
            return OrderPaymentCompleteResponse.from(order);
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId());

        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            validatePurchasableProduct(product);
            product.decreaseStock(orderItem.getQuantity());
        }

        Member member = order.getMember();
        if (order.getPointUsed() > 0) {
            member.usePoints(order.getPointUsed());
        }
        member.earnPoints(order.getPointEarned());
        order.completePayment();

        return OrderPaymentCompleteResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<MyOrderSummaryResponse> findMyOrders(Long memberId) {
        findMember(memberId);

        return orderRepository.findByMember_MemberIdOrderByOrderedAtDesc(memberId).stream()
                .map(order -> MyOrderSummaryResponse.from(order, findOrderItems(order.getOrderId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public MyOrderDetailResponse findMyOrder(Long memberId, Long orderId) {
        findMember(memberId);
        Order order = orderRepository.findByOrderIdAndMember_MemberId(orderId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        return MyOrderDetailResponse.from(order, findOrderItems(order.getOrderId()));
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    }

    private List<MyOrderItemResponse> findOrderItems(Long orderId) {
        return orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(orderId).stream()
                .map(MyOrderItemResponse::from)
                .toList();
    }

    private List<OrderLine> resolveOrderLines(List<OrderItemRequest> items) {
        List<OrderLine> orderLines = new ArrayList<>();

        for (OrderItemRequest item : items) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다. productId=" + item.productId()));
            int quantity = item.quantity();
            validatePurchasableProduct(product);

            if (product.getStock() < quantity) {
                throw new IllegalStateException("상품 재고가 부족합니다.");
            }

            BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            orderLines.add(new OrderLine(product, quantity, totalPrice, product.calculateRewardPoint(quantity)));
        }

        return orderLines;
    }

    private int resolvePointUsed(Member member, OrderCreateRequest request, BigDecimal totalOrderAmount) {
        if (!request.usePoints()) {
            return 0;
        }

        int pointAmount = request.pointAmount() == null ? 0 : request.pointAmount();
        if (pointAmount > member.getPointBalance()) {
            throw new IllegalArgumentException("사용 포인트가 보유 포인트보다 큽니다.");
        }

        if (BigDecimal.valueOf(pointAmount).compareTo(totalOrderAmount) > 0) {
            throw new IllegalArgumentException("사용 포인트가 주문 금액보다 큽니다.");
        }

        return pointAmount;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private void validatePurchasableProduct(Product product) {
        if (product.getSaleStatus() != ProductStatus.ON_SALE) {
            throw new IllegalStateException("현재 구매할 수 없는 상품입니다.");
        }
    }

    private String toOrderNumber(Long orderId) {
        return "OM-" + String.format("%06d", orderId);
    }

    private record OrderLine(Product product, int quantity, BigDecimal totalPrice, int pointEarned) {
    }
}

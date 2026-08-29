package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.order.dto.MyOrderDetailResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderItemResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderSummaryResponse;
import com.lubricantshop.back.domain.order.dto.OrderCreateRequest;
import com.lubricantshop.back.domain.order.dto.OrderCreateResponse;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final OrderLineResolver orderLineResolver;
    private final OrderPointCalculator orderPointCalculator;

    public OrderService(
            MemberRepository memberRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            OrderLineResolver orderLineResolver,
            OrderPointCalculator orderPointCalculator
    ) {
        this.memberRepository = memberRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.orderLineResolver = orderLineResolver;
        this.orderPointCalculator = orderPointCalculator;
    }

    @Transactional
    public OrderCreateResponse createOrder(Long memberId, OrderCreateRequest request) {
        Member member = findMember(memberId);
        List<OrderLine> orderLines = orderLineResolver.resolve(request.items());
        BigDecimal totalOrderAmount = orderLines.stream()
                .map(OrderLine::totalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int pointEarned = orderLines.stream()
                .mapToInt(OrderLine::pointEarned)
                .sum();
        int pointUsed = orderPointCalculator.resolvePointUsed(member, request, totalOrderAmount);
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
                order.getOrderStatus().name(),
                order.getPaymentMethod().name()
        );
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

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String toOrderNumber(Long orderId) {
        return "OM-" + String.format("%06d", orderId);
    }
}

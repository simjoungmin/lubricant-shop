package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.order.dto.AdminOrderItemResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderShipmentUpdateRequest;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.global.exception.ForbiddenException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderAdminService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MemberRepository memberRepository;

    public OrderAdminService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            MemberRepository memberRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> findOrders(Long adminId) {
        requireAdmin(adminId);

        return orderRepository.findAllByOrderByOrderedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminOrderResponse findOrder(Long adminId, Long orderId) {
        requireAdmin(adminId);

        Order order = findOrder(orderId);

        return toResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateStatus(Long adminId, Long orderId, AdminOrderStatusUpdateRequest request) {
        requireAdmin(adminId);

        if (request.orderStatus() == OrderStatus.PAID) {
            return completePayment(orderId);
        }

        Order order = findOrder(orderId);

        if (request.orderStatus() == OrderStatus.SHIPPING) {
            order.updateShipment(request.courier(), request.trackingNumber(), request.shipmentMemo());
        }

        order.changeStatus(request.orderStatus());

        return toResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateShipment(Long adminId, Long orderId, AdminOrderShipmentUpdateRequest request) {
        requireAdmin(adminId);

        Order order = findOrder(orderId);
        order.updateShipment(request.courier(), request.trackingNumber(), request.shipmentMemo());

        return toResponse(order);
    }

    @Transactional
    public AdminOrderResponse completePayment(Long adminId, Long orderId) {
        requireAdmin(adminId);
        return completePayment(orderId);
    }

    private AdminOrderResponse completePayment(Long orderId) {
        Order order = orderRepository.findByOrderIdForUpdate(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        return completePayment(order);
    }

    private AdminOrderResponse completePayment(Order order) {
        if (order.getOrderStatus() == OrderStatus.PAID) {
            return toResponse(order);
        }

        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new IllegalStateException("주문 접수 상태에서만 결제 완료 처리할 수 있습니다.");
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId());

        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            validatePurchasableProduct(product);
            product.decreaseStock(orderItem.getQuantity());
        }

        if (order.getPointUsed() > 0) {
            order.getMember().usePoints(order.getPointUsed());
        }
        order.getMember().earnPoints(order.getPointEarned());
        order.completePayment();

        return toResponse(order);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));
    }

    private Member requireAdmin(Long memberId) {
        Member admin = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        if (admin.getRole() != MemberRole.ADMIN) {
            throw new ForbiddenException("관리자만 주문을 관리할 수 있습니다.");
        }

        return admin;
    }

    private void validatePurchasableProduct(Product product) {
        if (product.getSaleStatus() != ProductStatus.ON_SALE) {
            throw new IllegalStateException("현재 구매할 수 없는 상품이 포함되어 있습니다.");
        }
    }

    private AdminOrderResponse toResponse(Order order) {
        List<AdminOrderItemResponse> items = orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId()).stream()
                .map(AdminOrderItemResponse::from)
                .toList();

        return AdminOrderResponse.from(order, items);
    }
}

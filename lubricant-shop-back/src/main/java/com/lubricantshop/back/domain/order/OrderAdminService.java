package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.service.AdminAuthorizationService;
import com.lubricantshop.back.domain.order.dto.AdminOrderItemResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderShipmentUpdateRequest;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderAdminService {

    private static final String ADMIN_ORDERS_FORBIDDEN_MESSAGE = "관리자만 주문을 관리할 수 있습니다.";

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AdminAuthorizationService adminAuthorizationService;
    private final OrderPaymentCompletionService orderPaymentCompletionService;

    public OrderAdminService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            AdminAuthorizationService adminAuthorizationService,
            OrderPaymentCompletionService orderPaymentCompletionService
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.adminAuthorizationService = adminAuthorizationService;
        this.orderPaymentCompletionService = orderPaymentCompletionService;
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

        if (request.orderStatus() == OrderStatus.SHIPPING && hasShipmentUpdate(request)) {
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
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 주문입니다."));

        return completePayment(order);
    }

    private AdminOrderResponse completePayment(Order order) {
        if (order.getOrderStatus() == OrderStatus.PAID) {
            return toResponse(order);
        }

        orderPaymentCompletionService.completePayment(order);

        return toResponse(order);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 주문입니다."));
    }

    private Member requireAdmin(Long memberId) {
        return adminAuthorizationService.requireAdmin(memberId, ADMIN_ORDERS_FORBIDDEN_MESSAGE);
    }

    private boolean hasShipmentUpdate(AdminOrderStatusUpdateRequest request) {
        return request.courier() != null
                || request.trackingNumber() != null
                || request.shipmentMemo() != null;
    }

    private AdminOrderResponse toResponse(Order order) {
        List<AdminOrderItemResponse> items = orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId()).stream()
                .map(AdminOrderItemResponse::from)
                .toList();

        return AdminOrderResponse.from(order, items);
    }
}

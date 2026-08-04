package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.AdminOrderItemResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderAdminService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderAdminService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> findOrders() {
        return orderRepository.findAllByOrderByOrderedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminOrderResponse updateStatus(Long orderId, AdminOrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        order.changeStatus(request.orderStatus());

        return toResponse(order);
    }

    private AdminOrderResponse toResponse(Order order) {
        List<AdminOrderItemResponse> items = orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId()).stream()
                .map(AdminOrderItemResponse::from)
                .toList();

        return AdminOrderResponse.from(order, items);
    }
}

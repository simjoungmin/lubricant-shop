package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.Order;
import com.lubricantshop.back.domain.order.OrderStatus;
import com.lubricantshop.back.domain.order.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MyOrderDetailResponse(
        Long orderId,
        String orderNumber,
        OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        BigDecimal totalOrderAmount,
        BigDecimal paymentAmount,
        Integer pointUsed,
        Integer pointEarned,
        String receiverName,
        String receiverPhone,
        String shippingAddress,
        String deliveryRequest,
        LocalDateTime orderedAt,
        LocalDateTime updatedAt,
        List<MyOrderItemResponse> items
) {
    public static MyOrderDetailResponse from(Order order, List<MyOrderItemResponse> items) {
        return new MyOrderDetailResponse(
                order.getOrderId(),
                "OM-" + String.format("%06d", order.getOrderId()),
                order.getOrderStatus(),
                order.getPaymentMethod(),
                order.getTotalOrderAmount(),
                order.getPaymentAmount(),
                order.getPointUsed(),
                order.getPointEarned(),
                order.getReceiverName(),
                order.getReceiverPhone(),
                order.getShippingAddress(),
                order.getDeliveryRequest(),
                order.getOrderedAt(),
                order.getUpdatedAt(),
                items
        );
    }
}

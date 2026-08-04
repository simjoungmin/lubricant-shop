package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.Order;
import com.lubricantshop.back.domain.order.OrderStatus;
import com.lubricantshop.back.domain.order.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderResponse(
        Long orderId,
        String orderNumber,
        Long memberId,
        String memberName,
        String memberEmail,
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
        List<AdminOrderItemResponse> items
) {
    public static AdminOrderResponse from(Order order, List<AdminOrderItemResponse> items) {
        return new AdminOrderResponse(
                order.getOrderId(),
                "OM-" + String.format("%06d", order.getOrderId()),
                order.getMember().getMemberId(),
                order.getMember().getMemberName(),
                order.getMember().getEmail(),
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

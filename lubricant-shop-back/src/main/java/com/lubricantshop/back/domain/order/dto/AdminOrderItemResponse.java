package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.OrderItem;
import java.math.BigDecimal;

public record AdminOrderItemResponse(
        Long orderItemId,
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal price,
        BigDecimal totalPrice,
        BigDecimal pointRewardRatePercent,
        Integer pointEarned
) {
    public static AdminOrderItemResponse from(OrderItem orderItem) {
        return new AdminOrderItemResponse(
                orderItem.getOrderItemId(),
                orderItem.getProduct().getProductId(),
                orderItem.getProductName(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getTotalPrice(),
                orderItem.getPointRewardRatePercent(),
                orderItem.getPointEarned()
        );
    }
}

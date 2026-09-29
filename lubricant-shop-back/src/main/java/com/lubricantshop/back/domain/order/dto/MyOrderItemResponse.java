package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.OrderItem;
import java.math.BigDecimal;

public record MyOrderItemResponse(
        Long orderItemId,
        Long productId,
        String productName,
        String imageUrl,
        Integer quantity,
        BigDecimal price,
        BigDecimal totalPrice,
        Integer pointEarned
) {
    public static MyOrderItemResponse from(OrderItem orderItem) {
        return new MyOrderItemResponse(
                orderItem.getOrderItemId(),
                orderItem.getProduct().getProductId(),
                orderItem.getProductName(),
                orderItem.getProduct().getImageUrl(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getTotalPrice(),
                orderItem.getPointEarned()
        );
    }
}

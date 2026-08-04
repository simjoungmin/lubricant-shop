package com.lubricantshop.back.domain.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        Integer totalQuantity,
        BigDecimal totalPrice,
        Integer expectedRewardPoint
) {

    public static CartResponse from(List<CartItemResponse> items) {
        int totalQuantity = items.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();
        BigDecimal totalPrice = items.stream()
                .map(CartItemResponse::totalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int expectedRewardPoint = items.stream()
                .mapToInt(CartItemResponse::pointEarned)
                .sum();

        return new CartResponse(items, totalQuantity, totalPrice, expectedRewardPoint);
    }
}

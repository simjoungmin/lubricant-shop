package com.lubricantshop.back.domain.cart.dto;

import com.lubricantshop.back.domain.cart.Cart;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponse(
        Long cartId,
        Long productId,
        String productName,
        String category,
        String brand,
        BigDecimal price,
        BigDecimal originalPrice,
        Integer stock,
        String imageUrl,
        String specification,
        BigDecimal pointRewardRatePercent,
        ProductStatus saleStatus,
        Integer quantity,
        BigDecimal totalPrice,
        Integer pointEarned,
        LocalDateTime updatedAt
) {

    public static CartItemResponse from(Cart cart) {
        Product product = cart.getProduct();
        int quantity = cart.getQuantity();
        BigDecimal price = product.getPrice();

        return new CartItemResponse(
                cart.getCartId(),
                product.getProductId(),
                product.getProductName(),
                product.getCategory(),
                product.getBrand(),
                price,
                product.getOriginalPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getSpecification(),
                product.getPointRewardRatePercent(),
                product.getSaleStatus(),
                quantity,
                price.multiply(BigDecimal.valueOf(quantity)),
                product.calculateRewardPoint(quantity),
                cart.getUpdatedAt()
        );
    }
}

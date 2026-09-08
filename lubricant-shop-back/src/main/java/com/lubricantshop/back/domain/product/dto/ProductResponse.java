package com.lubricantshop.back.domain.product.dto;

import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import java.math.BigDecimal;

public record ProductResponse(
        Long productId,
        String productName,
        String category,
        String subCategory,
        String brand,
        BigDecimal price,
        BigDecimal originalPrice,
        BigDecimal discountPrice,
        Integer stock,
        String productDescription,
        String viscosity,
        String specification,
        String volume,
        String imageUrl,
        ProductStatus saleStatus,
        BigDecimal pointRewardRatePercent
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getCategory(),
                product.getSubCategory(),
                product.getBrand(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getDiscountPrice(),
                product.getStock(),
                product.getProductDescription(),
                product.getViscosity(),
                product.getSpecification(),
                product.getVolume(),
                product.getImageUrl(),
                product.getSaleStatus(),
                product.getPointRewardRatePercent()
        );
    }
}

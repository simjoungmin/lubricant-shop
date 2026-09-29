package com.lubricantshop.back.domain.product.dto;

import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminProductResponse(
        Long productId,
        String productName,
        String category,
        String subCategory,
        List<String> subCategories,
        String brand,
        BigDecimal price,
        BigDecimal discountPrice,
        Integer stock,
        String productDescription,
        String viscosity,
        String specification,
        String volume,
        String imageUrl,
        ProductStatus saleStatus,
        BigDecimal pointRewardRatePercent,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AdminProductResponse from(Product product) {
        return new AdminProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getCategory(),
                product.getSubCategory(),
                product.getSubCategories(),
                product.getBrand(),
                product.getOriginalPrice(),
                product.getDiscountPrice(),
                product.getStock(),
                product.getProductDescription(),
                product.getViscosity(),
                product.getSpecification(),
                product.getVolume(),
                product.getImageUrl(),
                product.getSaleStatus(),
                product.getPointRewardRatePercent(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}

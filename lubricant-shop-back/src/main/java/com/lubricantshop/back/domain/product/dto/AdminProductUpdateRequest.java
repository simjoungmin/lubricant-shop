package com.lubricantshop.back.domain.product.dto;

import com.lubricantshop.back.domain.product.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AdminProductUpdateRequest(
        @Size(max = 160) String productName,
        @Size(max = 80) String category,
        @Size(max = 120) String subCategory,
        @Size(max = 80) String brand,
        @DecimalMin("0") BigDecimal price,
        @DecimalMin("0") BigDecimal discountPrice,
        @Min(0) Integer stock,
        String productDescription,
        @Size(max = 40) String viscosity,
        @Size(max = 120) String specification,
        @Size(max = 40) String volume,
        @Size(max = 500) String imageUrl,
        ProductStatus saleStatus,
        Boolean shouldClearDiscountPrice,
        @DecimalMin("0") BigDecimal pointRewardRatePercent
) {
}

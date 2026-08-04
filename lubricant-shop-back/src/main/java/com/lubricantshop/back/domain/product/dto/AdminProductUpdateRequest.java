package com.lubricantshop.back.domain.product.dto;

import com.lubricantshop.back.domain.product.ProductStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdminProductUpdateRequest(
        @NotNull @Min(0) Integer stock,
        @NotNull ProductStatus saleStatus
) {
}

package com.lubricantshop.back.domain.display.dto;

import com.lubricantshop.back.domain.product.dto.ProductResponse;
import java.util.List;

public record ProductDisplaySectionResponse(
        Long sectionId,
        String sectionCode,
        String sectionName,
        Integer displayOrder,
        List<ProductResponse> products
) {
}

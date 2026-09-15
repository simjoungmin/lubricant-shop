package com.lubricantshop.back.domain.product;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ProductTest {

    @Test
    void clearDiscountPriceRemovesDiscountAndUsesOriginalPrice() {
        Product product = new Product(
                "엔진오일",
                "engine",
                "synthetic",
                "OIL MASTER",
                BigDecimal.valueOf(30000),
                10,
                "합성 엔진오일",
                "5W-30",
                "API SP",
                "1L",
                "/images/oil.webp",
                ProductStatus.ON_SALE,
                BigDecimal.valueOf(25000),
                BigDecimal.valueOf(1)
        );

        product.clearDiscountPrice();

        assertNull(product.getDiscountPrice());
        assertEquals(BigDecimal.valueOf(30000), product.getPrice());
    }
}

package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.product.Product;
import java.math.BigDecimal;

record OrderLine(
        Product product,
        int quantity,
        BigDecimal totalPrice,
        int pointEarned
) {
}

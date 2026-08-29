package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.OrderItemRequest;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductRepository;
import com.lubricantshop.back.domain.product.ProductStatus;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OrderLineResolver {

    private final ProductRepository productRepository;

    public OrderLineResolver(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<OrderLine> resolve(List<OrderItemRequest> items) {
        List<OrderLine> orderLines = new ArrayList<>();

        for (OrderItemRequest item : items) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다. productId=" + item.productId()));
            int quantity = item.quantity();
            validatePurchasableProduct(product);

            if (product.getStock() < quantity) {
                throw new IllegalStateException("상품 재고가 부족합니다.");
            }

            BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            orderLines.add(new OrderLine(product, quantity, totalPrice, product.calculateRewardPoint(quantity)));
        }

        return orderLines;
    }

    private void validatePurchasableProduct(Product product) {
        if (product.getSaleStatus() != ProductStatus.ON_SALE) {
            throw new IllegalStateException("현재 구매할 수 없는 상품입니다.");
        }
    }
}

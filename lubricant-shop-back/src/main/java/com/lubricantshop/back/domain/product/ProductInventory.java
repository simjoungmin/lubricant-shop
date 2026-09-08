package com.lubricantshop.back.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProductInventory {

    @Column(name = "stock", nullable = false)
    private Integer stock = 0;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    protected ProductInventory() {
    }

    public ProductInventory(Integer stock) {
        changeStock(stock == null ? 0 : stock);
    }

    public Integer getStock() {
        return stock == null ? 0 : stock;
    }

    public Long getViewCount() {
        return viewCount == null ? 0L : viewCount;
    }

    public void changeStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("재고는 0보다 작을 수 없습니다.");
        }

        this.stock = stock;
    }

    public void decreaseStock(int quantity, Long productId) {
        ProductValidation.validatePositiveQuantity(quantity);

        if (getStock() < quantity) {
            throw new IllegalArgumentException("상품 재고가 부족합니다. productId=" + productId);
        }

        stock = getStock() - quantity;
    }

    public void ensureDefaults() {
        if (stock == null) {
            stock = 0;
        }
        if (viewCount == null) {
            viewCount = 0L;
        }
    }
}

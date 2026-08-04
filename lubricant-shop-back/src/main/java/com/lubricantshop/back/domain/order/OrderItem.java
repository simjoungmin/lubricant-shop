package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.product.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

// 주문에 포함된 개별 상품 라인입니다. 주문 당시의 상품명, 가격, 적립률을 함께 보관합니다.
@Entity
@Table(name = "order_item")
public class OrderItem {

    // 주문 품목 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    // 이 품목이 속한 주문입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // 주문한 상품 원본입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 주문 시점의 상품명입니다. 상품명이 나중에 바뀌어도 주문 내역은 유지됩니다.
    @Column(name = "product_name", nullable = false, length = 160)
    private String productName;

    // 주문 수량입니다.
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // 주문 시점의 상품 단가입니다.
    @Column(name = "price", nullable = false, precision = 12, scale = 0)
    private BigDecimal price;

    // 단가에 수량을 곱한 품목 합계 금액입니다.
    @Column(name = "total_price", nullable = false, precision = 12, scale = 0)
    private BigDecimal totalPrice;

    // 주문 시점의 포인트 적립률입니다.
    @Column(name = "point_reward_rate_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal pointRewardRatePercent;

    // 이 품목으로 적립된 포인트입니다.
    @Column(name = "point_earned", nullable = false)
    private Integer pointEarned;

    protected OrderItem() {
    }

    public OrderItem(Order order, Product product, Integer quantity, Integer pointEarned) {
        this.order = order;
        this.product = product;
        this.productName = product.getProductName();
        this.quantity = quantity;
        this.price = product.getPrice();
        this.totalPrice = this.price.multiply(BigDecimal.valueOf(quantity));
        this.pointRewardRatePercent = product.getPointRewardRatePercent();
        this.pointEarned = pointEarned;
    }

    public Long getOrderItemId() {
        return orderItemId;
    }

    public Order getOrder() {
        return order;
    }

    public Product getProduct() {
        return product;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public BigDecimal getPointRewardRatePercent() {
        return pointRewardRatePercent;
    }

    public Integer getPointEarned() {
        return pointEarned;
    }
}

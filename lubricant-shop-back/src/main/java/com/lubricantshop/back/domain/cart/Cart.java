package com.lubricantshop.back.domain.cart;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.product.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "cart",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_cart_member_product", columnNames = {"member_id", "product_id"})
        }
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Cart() {
    }

    public Cart(Member member, Product product, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("장바구니 수량은 1개 이상이어야 합니다.");
        }

        this.member = member;
        this.product = product;
        this.quantity = quantity;
    }

    public Long getCartId() {
        return cartId;
    }

    public Product getProduct() {
        return product;
    }

    public Integer getQuantity() {
        return quantity == null ? 0 : quantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void increaseQuantity(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("추가 수량은 1개 이상이어야 합니다.");
        }

        quantity = getQuantity() + amount;
    }

    public void changeQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("장바구니 수량은 1개 이상이어야 합니다.");
        }

        this.quantity = quantity;
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

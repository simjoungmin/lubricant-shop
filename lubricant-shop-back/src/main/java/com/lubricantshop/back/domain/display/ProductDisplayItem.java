package com.lubricantshop.back.domain.display;

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
import java.time.LocalDateTime;

@Entity
@Table(name = "product_display_item")
public class ProductDisplayItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private ProductDisplaySection section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_visible", nullable = false)
    private Boolean visible = true;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;

    @Column(name = "ends_at")
    private LocalDateTime endsAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected ProductDisplayItem() {
    }

    public ProductDisplayItem(
            ProductDisplaySection section,
            Product product,
            Integer displayOrder,
            Boolean visible,
            LocalDateTime startsAt,
            LocalDateTime endsAt
    ) {
        this.section = section;
        this.product = product;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
        this.visible = visible == null || visible;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
    }

    public Long getItemId() {
        return itemId;
    }

    public ProductDisplaySection getSection() {
        return section;
    }

    public Product getProduct() {
        return product;
    }

    public Integer getDisplayOrder() {
        return displayOrder == null ? 0 : displayOrder;
    }

    public Boolean getVisible() {
        return visible;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public boolean isDisplayable(LocalDateTime now) {
        return Boolean.TRUE.equals(visible)
                && (startsAt == null || !startsAt.isAfter(now))
                && (endsAt == null || !endsAt.isBefore(now));
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (displayOrder == null) {
            displayOrder = 0;
        }
        if (visible == null) {
            visible = true;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

package com.lubricantshop.back.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Embedded
    private ProductBasicInfo basicInfo = new ProductBasicInfo();

    @Embedded
    private ProductPriceInfo priceInfo = new ProductPriceInfo();

    @Embedded
    private ProductInventory inventory = new ProductInventory();

    @Enumerated(EnumType.STRING)
    @Column(name = "sale_status", nullable = false, length = 30)
    private ProductStatus saleStatus = ProductStatus.ON_SALE;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean deleted = false;

    protected Product() {
    }

    public Product(
            String productName,
            String category,
            String subCategory,
            String brand,
            BigDecimal price,
            Integer stock,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl,
            ProductStatus saleStatus,
            BigDecimal discountPrice,
            BigDecimal pointRewardRatePercent
    ) {
        basicInfo = new ProductBasicInfo(
                productName,
                category,
                subCategory,
                brand,
                productDescription,
                viscosity,
                specification,
                volume,
                imageUrl
        );
        priceInfo = new ProductPriceInfo(price, discountPrice, pointRewardRatePercent);
        inventory = new ProductInventory(stock);
        changeSaleStatus(saleStatus == null ? ProductStatus.ON_SALE : saleStatus);
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return basicInfo.getProductName();
    }

    public String getCategory() {
        return basicInfo.getCategory();
    }

    public String getSubCategory() {
        return basicInfo.getSubCategory();
    }

    public String getBrand() {
        return basicInfo.getBrand();
    }

    public BigDecimal getOriginalPrice() {
        return priceInfo.getOriginalPrice();
    }

    public BigDecimal getPrice() {
        return priceInfo.getSalePrice();
    }

    public Integer getStock() {
        return inventory.getStock();
    }

    public String getProductDescription() {
        return basicInfo.getProductDescription();
    }

    public String getViscosity() {
        return basicInfo.getViscosity();
    }

    public String getSpecification() {
        return basicInfo.getSpecification();
    }

    public String getVolume() {
        return basicInfo.getVolume();
    }

    public String getImageUrl() {
        return basicInfo.getImageUrl();
    }

    public ProductStatus getSaleStatus() {
        return saleStatus;
    }

    public BigDecimal getDiscountPrice() {
        return priceInfo.getDiscountPrice();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Boolean isDeleted() {
        return deleted;
    }

    public Long getViewCount() {
        return inventory.getViewCount();
    }

    public BigDecimal getPointRewardRatePercent() {
        return priceInfo.getPointRewardRatePercent();
    }

    public int calculateRewardPoint(int quantity) {
        return priceInfo.calculateRewardPoint(quantity);
    }

    public void changeStock(int stock) {
        inventory.changeStock(stock);
    }

    public void changeSaleStatus(ProductStatus saleStatus) {
        if (saleStatus == null) {
            throw new IllegalArgumentException("판매 상태를 입력해 주세요.");
        }

        this.saleStatus = saleStatus;
    }

    public void updateAdminInfo(
            String productName,
            String category,
            String subCategory,
            String brand,
            BigDecimal price,
            BigDecimal discountPrice,
            Integer stock,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl,
            ProductStatus saleStatus,
            BigDecimal pointRewardRatePercent
    ) {
        basicInfo.updateIfPresent(
                productName,
                category,
                subCategory,
                brand,
                productDescription,
                viscosity,
                specification,
                volume,
                imageUrl
        );
        priceInfo.updateIfPresent(price, discountPrice, pointRewardRatePercent);

        if (stock != null) {
            changeStock(stock);
        }
        if (saleStatus != null) {
            changeSaleStatus(saleStatus);
        }
    }

    public void clearDiscountPrice() {
        priceInfo.clearDiscountPrice();
    }

    public void markDeleted() {
        deleted = true;
        saleStatus = ProductStatus.HIDDEN;
    }

    public void decreaseStock(int quantity) {
        inventory.decreaseStock(quantity, productId);
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        inventory.ensureDefaults();
        priceInfo.ensureDefaults();

        if (saleStatus == null) {
            saleStatus = ProductStatus.ON_SALE;
        }
        if (deleted == null) {
            deleted = false;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

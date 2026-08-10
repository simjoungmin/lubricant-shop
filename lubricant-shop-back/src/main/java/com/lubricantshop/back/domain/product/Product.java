package com.lubricantshop.back.domain.product;

import jakarta.persistence.Column;
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
import java.math.RoundingMode;
import java.time.LocalDateTime;

// 판매 상품의 기본 정보, 가격, 재고, 노출 상태, 포인트 적립률을 저장하는 엔티티입니다.
@Entity
@Table(name = "product")
public class Product {

    // 상품 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    // 고객과 관리자 화면에 표시되는 상품명입니다.
    @Column(name = "product_name", nullable = false, length = 160)
    private String productName;

    // 엔진오일, 필터, 케미컬 등 상품이 속한 카테고리 코드입니다.
    @Column(name = "category", nullable = false, length = 80)
    private String category;

    // 제조사 또는 브랜드명입니다.
    @Column(name = "brand", nullable = false, length = 80)
    private String brand;

    // 할인 전 기준 판매가입니다.
    @Column(name = "price", nullable = false, precision = 12, scale = 0)
    private BigDecimal price;

    // 현재 판매 가능한 재고 수량입니다.
    @Column(name = "stock", nullable = false)
    private Integer stock;

    // 상품 상세 설명입니다.
    @Column(name = "product_description", columnDefinition = "TEXT")
    private String productDescription;

    // 엔진오일/기어오일 등 오일 상품의 점도 정보입니다.
    @Column(name = "viscosity", length = 40)
    private String viscosity;

    // API, ACEA, DOT 등 상품 규격 또는 호환 정보입니다.
    @Column(name = "specification", length = 120)
    private String specification;

    // 상품 용량 또는 세트 구성 수량입니다.
    @Column(name = "volume", length = 40)
    private String volume;

    // 상품 대표 이미지 경로입니다.
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // 판매중, 품절, 판매중지, 숨김 등 판매 상태입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "sale_status", nullable = false, length = 30)
    private ProductStatus saleStatus = ProductStatus.ON_SALE;

    // 상품 최초 등록 시각입니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 상품 정보가 마지막으로 수정된 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 할인 판매가입니다. 값이 있으면 실제 판매가는 이 값을 우선 사용합니다.
    @Column(name = "discount_price", precision = 12, scale = 0)
    private BigDecimal discountPrice;

    // 메인 화면 대표 상품 노출 여부입니다.
    @Column(name = "is_main_product", nullable = false)
    private Boolean mainProduct = false;

    // 추천 상품 영역 노출 여부입니다.
    @Column(name = "is_recommended", nullable = false)
    private Boolean recommended = false;

    // 상품 상세 조회 수입니다.
    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    // 실제 삭제 대신 목록에서 제외하기 위한 소프트 삭제 여부입니다.
    @Column(name = "is_deleted", nullable = false)
    private Boolean deleted = false;

    // 구매 시 적립할 포인트 비율입니다. 예: 5.00이면 결제 상품금액의 5% 적립.
    @Column(name = "point_reward_rate_percent", nullable = false, precision = 5, scale = 2, columnDefinition = "decimal(5,2) default 0.00")
    private BigDecimal pointRewardRatePercent = BigDecimal.ZERO;

    protected Product() {
    }

    public Product(
            String productName,
            String category,
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
            Boolean mainProduct,
            Boolean recommended,
            BigDecimal pointRewardRatePercent
    ) {
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.stock = stock;
        this.productDescription = productDescription;
        this.viscosity = viscosity;
        this.specification = specification;
        this.volume = volume;
        this.imageUrl = imageUrl;
        this.saleStatus = saleStatus;
        this.discountPrice = discountPrice;
        this.mainProduct = mainProduct;
        this.recommended = recommended;
        this.pointRewardRatePercent = pointRewardRatePercent;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

    public String getBrand() {
        return brand;
    }

    public BigDecimal getOriginalPrice() {
        return price;
    }

    public BigDecimal getPrice() {
        return discountPrice != null ? discountPrice : price;
    }

    public Integer getStock() {
        return stock == null ? 0 : stock;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public String getViscosity() {
        return viscosity;
    }

    public String getSpecification() {
        return specification;
    }

    public String getVolume() {
        return volume;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public ProductStatus getSaleStatus() {
        return saleStatus;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public Boolean getMainProduct() {
        return mainProduct;
    }

    public Boolean getRecommended() {
        return recommended;
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

    public BigDecimal getPointRewardRatePercent() {
        return pointRewardRatePercent == null ? BigDecimal.ZERO : pointRewardRatePercent;
    }

    // 상품 금액과 상품별 적립률을 기준으로 구매 수량만큼 적립될 포인트를 계산합니다.
    public int calculateRewardPoint(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("상품 수량은 1개 이상이어야 합니다.");
        }

        BigDecimal lineAmount = getPrice().multiply(BigDecimal.valueOf(quantity));
        return lineAmount
                .multiply(getPointRewardRatePercent())
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN)
                .intValue();
    }

    // 관리자 재고 관리 화면에서 입력한 재고 수량으로 변경합니다.
    public void changeStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("재고는 0보다 작을 수 없습니다.");
        }

        this.stock = stock;
    }

    // 관리자 주문/상품 운영에서 판매 상태를 변경합니다.
    public void changeSaleStatus(ProductStatus saleStatus) {
        this.saleStatus = saleStatus;
    }

    public void updateAdminInfo(
            String productName,
            String category,
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
            BigDecimal pointRewardRatePercent,
            Boolean mainProduct,
            Boolean recommended
    ) {
        if (productName != null) {
            this.productName = requireText(productName, "상품명을 입력해 주세요.");
        }
        if (category != null) {
            this.category = requireText(category, "카테고리를 입력해 주세요.");
        }
        if (brand != null) {
            this.brand = requireText(brand, "브랜드를 입력해 주세요.");
        }
        if (price != null) {
            if (price.signum() < 0) {
                throw new IllegalArgumentException("정상 판매가는 0보다 작을 수 없습니다.");
            }
            this.price = price;
        }
        if (discountPrice != null) {
            if (discountPrice.signum() < 0) {
                throw new IllegalArgumentException("할인 판매가는 0보다 작을 수 없습니다.");
            }
            this.discountPrice = discountPrice;
        }
        if (stock != null) {
            changeStock(stock);
        }
        if (productDescription != null) {
            this.productDescription = trimToNull(productDescription);
        }
        if (viscosity != null) {
            this.viscosity = trimToNull(viscosity);
        }
        if (specification != null) {
            this.specification = trimToNull(specification);
        }
        if (volume != null) {
            this.volume = trimToNull(volume);
        }
        if (imageUrl != null) {
            this.imageUrl = trimToNull(imageUrl);
        }
        if (saleStatus != null) {
            changeSaleStatus(saleStatus);
        }
        if (pointRewardRatePercent != null) {
            if (pointRewardRatePercent.signum() < 0) {
                throw new IllegalArgumentException("적립률은 0보다 작을 수 없습니다.");
            }
            this.pointRewardRatePercent = pointRewardRatePercent;
        }
        if (mainProduct != null) {
            this.mainProduct = mainProduct;
        }
        if (recommended != null) {
            this.recommended = recommended;
        }
    }

    // 상품을 실제 삭제하지 않고 숨김 처리합니다.
    public void markDeleted() {
        deleted = true;
        saleStatus = ProductStatus.HIDDEN;
    }

    // 주문 생성 시 구매 수량만큼 재고를 차감합니다.
    public void decreaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("차감 수량은 1개 이상이어야 합니다.");
        }

        if (getStock() < quantity) {
            throw new IllegalArgumentException("상품 재고가 부족합니다. productId=" + productId);
        }

        stock = getStock() - quantity;
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }

        return value.trim();
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (stock == null) {
            stock = 0;
        }
        if (mainProduct == null) {
            mainProduct = false;
        }
        if (recommended == null) {
            recommended = false;
        }
        if (pointRewardRatePercent == null) {
            pointRewardRatePercent = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

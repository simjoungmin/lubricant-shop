package com.lubricantshop.back.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Embeddable
public class ProductPriceInfo {

    private static final BigDecimal DEFAULT_POINT_REWARD_RATE_PERCENT = BigDecimal.ZERO;

    @Column(name = "price", nullable = false, precision = 12, scale = 0)
    private BigDecimal price;

    @Column(name = "discount_price", precision = 12, scale = 0)
    private BigDecimal discountPrice;

    @Column(name = "point_reward_rate_percent", nullable = false, precision = 5, scale = 2, columnDefinition = "decimal(5,2) default 0.00")
    private BigDecimal pointRewardRatePercent = DEFAULT_POINT_REWARD_RATE_PERCENT;

    protected ProductPriceInfo() {
    }

    public ProductPriceInfo(
            BigDecimal price,
            BigDecimal discountPrice,
            BigDecimal pointRewardRatePercent
    ) {
        this.price = ProductValidation.requireNonNegative(price, "정상 판매가는 0보다 작을 수 없습니다.");
        updateDiscountPrice(discountPrice);
        updatePointRewardRatePercent(pointRewardRatePercent);
    }

    public BigDecimal getOriginalPrice() {
        return price;
    }

    public BigDecimal getSalePrice() {
        return discountPrice != null ? discountPrice : price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public BigDecimal getPointRewardRatePercent() {
        return pointRewardRatePercent == null
                ? DEFAULT_POINT_REWARD_RATE_PERCENT
                : pointRewardRatePercent;
    }

    public int calculateRewardPoint(int quantity) {
        ProductValidation.validatePositiveQuantity(quantity);

        BigDecimal lineAmount = getSalePrice().multiply(BigDecimal.valueOf(quantity));
        return lineAmount
                .multiply(getPointRewardRatePercent())
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN)
                .intValue();
    }

    public void updateIfPresent(
            BigDecimal price,
            BigDecimal discountPrice,
            BigDecimal pointRewardRatePercent
    ) {
        if (price != null) {
            this.price = ProductValidation.requireNonNegative(price, "정상 판매가는 0보다 작을 수 없습니다.");
        }
        if (discountPrice != null) {
            updateDiscountPrice(discountPrice);
        }
        if (pointRewardRatePercent != null) {
            updatePointRewardRatePercent(pointRewardRatePercent);
        }
    }

    public void ensureDefaults() {
        if (pointRewardRatePercent == null) {
            pointRewardRatePercent = DEFAULT_POINT_REWARD_RATE_PERCENT;
        }
    }

    private void updateDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice == null
                ? null
                : ProductValidation.requireNonNegative(discountPrice, "할인 판매가는 0보다 작을 수 없습니다.");
    }

    private void updatePointRewardRatePercent(BigDecimal pointRewardRatePercent) {
        this.pointRewardRatePercent = pointRewardRatePercent == null
                ? DEFAULT_POINT_REWARD_RATE_PERCENT
                : ProductValidation.requireNonNegative(pointRewardRatePercent, "적립률은 0보다 작을 수 없습니다.");
    }
}

package com.lubricantshop.back.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProductBasicInfo {

    @Column(name = "product_name", nullable = false, length = 160)
    private String productName;

    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "sub_category", length = 120)
    private String subCategory;

    @Column(name = "brand", nullable = false, length = 80)
    private String brand;

    @Column(name = "product_description", columnDefinition = "TEXT")
    private String productDescription;

    @Column(name = "viscosity", length = 40)
    private String viscosity;

    @Column(name = "specification", length = 120)
    private String specification;

    @Column(name = "volume", length = 40)
    private String volume;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    protected ProductBasicInfo() {
    }

    public ProductBasicInfo(
            String productName,
            String category,
            String subCategory,
            String brand,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl
    ) {
        this.productName = ProductValidation.requireText(productName, "상품명을 입력해 주세요.");
        this.category = ProductValidation.requireText(category, "카테고리를 입력해 주세요.");
        this.brand = ProductValidation.requireText(brand, "브랜드를 입력해 주세요.");
        updateOptionalInfo(subCategory, productDescription, viscosity, specification, volume, imageUrl);
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public String getBrand() {
        return brand;
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

    public void updateIfPresent(
            String productName,
            String category,
            String subCategory,
            String brand,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl
    ) {
        if (productName != null) {
            this.productName = ProductValidation.requireText(productName, "상품명을 입력해 주세요.");
        }
        if (category != null) {
            this.category = ProductValidation.requireText(category, "카테고리를 입력해 주세요.");
        }
        if (brand != null) {
            this.brand = ProductValidation.requireText(brand, "브랜드를 입력해 주세요.");
        }
        updateOptionalInfoIfPresent(subCategory, productDescription, viscosity, specification, volume, imageUrl);
    }

    private void updateOptionalInfo(
            String subCategory,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl
    ) {
        this.subCategory = ProductValidation.trimToNull(subCategory);
        this.productDescription = ProductValidation.trimToNull(productDescription);
        this.viscosity = ProductValidation.trimToNull(viscosity);
        this.specification = ProductValidation.trimToNull(specification);
        this.volume = ProductValidation.trimToNull(volume);
        this.imageUrl = ProductValidation.trimToNull(imageUrl);
    }

    private void updateOptionalInfoIfPresent(
            String subCategory,
            String productDescription,
            String viscosity,
            String specification,
            String volume,
            String imageUrl
    ) {
        if (subCategory != null) {
            this.subCategory = ProductValidation.trimToNull(subCategory);
        }
        if (productDescription != null) {
            this.productDescription = ProductValidation.trimToNull(productDescription);
        }
        if (viscosity != null) {
            this.viscosity = ProductValidation.trimToNull(viscosity);
        }
        if (specification != null) {
            this.specification = ProductValidation.trimToNull(specification);
        }
        if (volume != null) {
            this.volume = ProductValidation.trimToNull(volume);
        }
        if (imageUrl != null) {
            this.imageUrl = ProductValidation.trimToNull(imageUrl);
        }
    }
}

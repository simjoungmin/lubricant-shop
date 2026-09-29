package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.product.dto.ProductResponse;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private static final String DEFAULT_QUERY_VALUE = "";
    private static final String LIKE_WILDCARD = "%";

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findProducts(
            String category,
            String subCategory,
            String brand,
            String keyword,
            String fuelType,
            String viscosity,
            String standard,
            String sort
    ) {
        ProductSearchCondition condition = ProductSearchCondition.from(
                category,
                subCategory,
                brand,
                keyword,
                fuelType,
                viscosity,
                standard
        );

        return productRepository.searchOnSaleProducts(
                        ProductStatus.ON_SALE,
                        condition.hasCategory(),
                        condition.categories(),
                        condition.hasSubCategory(),
                        condition.isBrandSubCategory(),
                        condition.subCategory(),
                        condition.hasBrand(),
                        condition.brand(),
                        condition.hasKeyword(),
                        condition.keyword(),
                        condition.hasFuelType(),
                        condition.fuelType(),
                        condition.hasViscosity(),
                        condition.viscosity(),
                        condition.hasStandard(),
                        condition.standard()
                )
                .stream()
                .sorted(resolveSort(sort))
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> findBrands(
            String category,
            String subCategory,
            String keyword,
            String fuelType,
            String viscosity,
            String standard
    ) {
        ProductSearchCondition condition = ProductSearchCondition.from(
                category,
                subCategory,
                null,
                keyword,
                fuelType,
                viscosity,
                standard
        );

        return productRepository.findDistinctBrandsBySearch(
                        ProductStatus.ON_SALE,
                        condition.hasCategory(),
                        condition.categories(),
                        condition.hasSubCategory(),
                        condition.isBrandSubCategory(),
                        condition.subCategory(),
                        condition.hasKeyword(),
                        condition.keyword(),
                        condition.hasFuelType(),
                        condition.fuelType(),
                        condition.hasViscosity(),
                        condition.viscosity(),
                        condition.hasStandard(),
                        condition.standard()
                )
                .stream()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .filter(foundProduct -> !Boolean.TRUE.equals(foundProduct.isDeleted()))
                .filter(foundProduct -> foundProduct.getSaleStatus() == ProductStatus.ON_SALE)
                .orElseThrow(() -> new ResourceNotFoundException("판매 중인 상품을 찾을 수 없습니다."));

        return ProductResponse.from(product);
    }

    private Comparator<Product> resolveSort(String sort) {
        if ("price-low".equals(sort)) {
            return Comparator.comparing(Product::getPrice);
        }

        if ("price-high".equals(sort)) {
            return Comparator.comparing(Product::getPrice).reversed();
        }

        return Comparator
                .comparing(Product::getViewCount, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Product::getProductId);
    }

    private record ProductSearchCondition(
            boolean hasCategory,
            List<String> categories,
            boolean hasSubCategory,
            boolean isBrandSubCategory,
            String subCategory,
            boolean hasBrand,
            String brand,
            boolean hasKeyword,
            String keyword,
            boolean hasFuelType,
            String fuelType,
            boolean hasViscosity,
            String viscosity,
            boolean hasStandard,
            String standard
    ) {

        private static ProductSearchCondition from(
                String category,
                String subCategory,
                String brand,
                String keyword,
                String fuelType,
                String viscosity,
                String standard
        ) {
            String normalizedCategory = normalize(category);
            String normalizedSubCategory = normalize(subCategory);
            String normalizedBrand = normalize(brand);
            String normalizedKeyword = normalize(keyword);
            String normalizedFuelType = normalize(fuelType);
            String normalizedViscosity = normalize(viscosity);
            String normalizedStandard = normalize(standard);

            return new ProductSearchCondition(
                    !isBlank(normalizedCategory),
                    resolveCategoryAliases(normalizedCategory),
                    !isBlank(normalizedSubCategory),
                    "brandengineoil".equals(normalizedSubCategory),
                    normalizedSubCategory,
                    !isBlank(normalizedBrand),
                    normalizedBrand,
                    !isBlank(normalizedKeyword),
                    like(normalizedKeyword),
                    !isBlank(normalizedFuelType),
                    normalizedFuelType,
                    !isBlank(normalizedViscosity),
                    normalizedViscosity,
                    !isBlank(normalizedStandard),
                    like(normalizedStandard)
            );
        }

        private static List<String> resolveCategoryAliases(String category) {
            return switch (category) {
                case "brakepower" -> List.of("brakepower", "brake");
                case "coolant" -> List.of("coolant", "chemical");
                case DEFAULT_QUERY_VALUE -> List.of(DEFAULT_QUERY_VALUE);
                default -> List.of(category);
            };
        }

        private static String normalize(String value) {
            if (value == null) {
                return DEFAULT_QUERY_VALUE;
            }

            return value
                    .toLowerCase(Locale.ROOT)
                    .replace(" ", "")
                    .replace("-", "")
                    .replace("/", "");
        }

        private static String like(String value) {
            return LIKE_WILDCARD + value + LIKE_WILDCARD;
        }

        private static boolean isBlank(String value) {
            return value == null || value.isBlank();
        }
    }
}

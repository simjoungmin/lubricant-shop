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
                        condition.subCategoryKeyword(),
                        condition.subCategoryKeyword1(),
                        condition.subCategoryKeyword2(),
                        condition.subCategoryKeyword3(),
                        condition.subCategoryKeyword4(),
                        condition.subCategoryKeyword5(),
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
                        condition.subCategoryKeyword(),
                        condition.subCategoryKeyword1(),
                        condition.subCategoryKeyword2(),
                        condition.subCategoryKeyword3(),
                        condition.subCategoryKeyword4(),
                        condition.subCategoryKeyword5(),
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
            String subCategoryKeyword,
            String subCategoryKeyword1,
            String subCategoryKeyword2,
            String subCategoryKeyword3,
            String subCategoryKeyword4,
            String subCategoryKeyword5,
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
            List<String> subCategoryKeywords = resolveSubCategoryKeywords(normalizedSubCategory);

            return new ProductSearchCondition(
                    !isBlank(normalizedCategory),
                    resolveCategoryAliases(normalizedCategory),
                    !isBlank(normalizedSubCategory),
                    "brandengineoil".equals(normalizedSubCategory),
                    normalizedSubCategory,
                    like(normalizedSubCategory),
                    likeKeyword(subCategoryKeywords, 0),
                    likeKeyword(subCategoryKeywords, 1),
                    likeKeyword(subCategoryKeywords, 2),
                    likeKeyword(subCategoryKeywords, 3),
                    likeKeyword(subCategoryKeywords, 4),
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

        private static List<String> resolveSubCategoryKeywords(String subCategory) {
            return switch (subCategory) {
                case "brandengineoil" -> List.of("브랜드", "zic", "kixx", "mobil", "shell");
                case "viscosityengineoil" -> List.of("0w20", "0w30", "5w30", "5w40", "10w40");
                case "gasolinelpgengineoil" -> List.of("가솔린", "lpg");
                case "passengerdieselinegineoil", "passengerdieselengineoil" -> List.of("승용", "디젤", "diesel");
                case "racingbikeengineoil" -> List.of("레이싱", "바이크", "racing", "bike");
                case "drum200lengineoil" -> List.of("200l", "200리터", "드럼", "자가하차");
                case "dctdctf" -> List.of("dct", "dctf");
                case "gearoil" -> List.of("기어오일", "gl5");
                case "transfercase" -> List.of("트랜스퍼케이스", "transfercase");
                case "brakefluid" -> List.of("브레이크액", "dot");
                case "poweroil" -> List.of("파워오일");
                case "orangepink" -> List.of("주황색", "분홍색");
                case "enginesystem" -> List.of("엔진", "첨가제", "불스원샷");
                case "airconradiator" -> List.of("에어컨", "라디에이터");
                case "missionadditive" -> List.of("미션첨가제", "미션", "첨가제");
                case "rustproofcleaner" -> List.of("방청유", "세정제");
                case "washerfluid" -> List.of("워셔액");
                case "hydraulicoil" -> List.of("유압유");
                default -> List.of(subCategory);
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

        private static String likeKeyword(List<String> keywords, int index) {
            if (keywords.size() <= index) {
                return like(DEFAULT_QUERY_VALUE);
            }

            return like(normalize(keywords.get(index)));
        }

        private static boolean isBlank(String value) {
            return value == null || value.isBlank();
        }
    }
}

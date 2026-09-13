package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.product.dto.ProductResponse;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

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
        return productRepository.findByDeletedFalseAndSaleStatusOrderByProductIdAsc(ProductStatus.ON_SALE)
                .stream()
                .filter(product -> isMatchedCategory(product, category))
                .filter(product -> isMatchedSubCategory(product, subCategory))
                .filter(product -> isMatchedBrand(product, brand))
                .filter(product -> isMatchedKeyword(product, keyword))
                .filter(product -> isMatchedFuelType(product, fuelType))
                .filter(product -> isMatchedViscosity(product, viscosity))
                .filter(product -> isMatchedStandard(product, standard))
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
        return productRepository.findByDeletedFalseAndSaleStatusOrderByProductIdAsc(ProductStatus.ON_SALE)
                .stream()
                .filter(product -> isMatchedCategory(product, category))
                .filter(product -> isMatchedSubCategory(product, subCategory))
                .filter(product -> isMatchedKeyword(product, keyword))
                .filter(product -> isMatchedFuelType(product, fuelType))
                .filter(product -> isMatchedViscosity(product, viscosity))
                .filter(product -> isMatchedStandard(product, standard))
                .map(Product::getBrand)
                .filter(brand -> !isBlank(brand))
                .map(String::trim)
                .distinct()
                .sorted((firstBrand, secondBrand) -> firstBrand.compareToIgnoreCase(secondBrand))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .filter(foundProduct -> !Boolean.TRUE.equals(foundProduct.isDeleted()))
                .filter(foundProduct -> foundProduct.getSaleStatus() == ProductStatus.ON_SALE)
                .orElseThrow(() -> new IllegalArgumentException("판매 중인 상품을 찾을 수 없습니다."));

        return ProductResponse.from(product);
    }

    private boolean isMatchedCategory(Product product, String category) {
        if (isBlank(category)) {
            return true;
        }

        String normalizedCategory = normalize(category);
        String normalizedProductCategory = normalize(product.getCategory());

        return normalizedProductCategory.equals(normalizedCategory)
                || resolveCategoryAliases(normalizedCategory).contains(normalizedProductCategory);
    }

    private boolean isMatchedSubCategory(Product product, String subCategory) {
        if (isBlank(subCategory)) {
            return true;
        }

        String normalizedSubCategory = normalize(subCategory);
        String productSubCategory = normalize(product.getSubCategory());
        String productName = normalize(product.getProductName());
        String brand = normalize(product.getBrand());
        String productDescription = normalize(product.getProductDescription());
        String specification = normalize(product.getSpecification());
        String viscosity = normalize(product.getViscosity());
        String searchableText = String.join(" ", productName, brand, productDescription, specification, viscosity);

        if ("brandengineoil".equals(normalizedSubCategory)) {
            return !isBlank(product.getBrand());
        }

        return productSubCategory.equals(normalizedSubCategory)
                || viscosity.equals(normalizedSubCategory)
                || specification.contains(normalizedSubCategory)
                || productName.contains(normalizedSubCategory)
                || resolveSubCategoryKeywords(normalizedSubCategory).stream()
                .map(this::normalize)
                .anyMatch(searchableText::contains);
    }

    private List<String> resolveCategoryAliases(String category) {
        return switch (category) {
            case "brakepower" -> List.of("brake");
            case "coolant" -> List.of("chemical");
            default -> List.of();
        };
    }

    private List<String> resolveSubCategoryKeywords(String subCategory) {
        return switch (subCategory) {
            case "brandengineoil" -> List.of("브랜드", "zic", "kixx", "mobil", "shell", "castrol");
            case "viscosityengineoil" -> List.of("0w20", "0w30", "5w30", "5w40", "10w40", "15w40");
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

    private boolean isMatchedBrand(Product product, String brand) {
        if (isBlank(brand)) {
            return true;
        }

        return normalize(product.getBrand()).equals(normalize(brand));
    }

    private boolean isMatchedKeyword(Product product, String keyword) {
        if (isBlank(keyword)) {
            return true;
        }

        String normalizedKeyword = normalize(keyword);
        String searchableText = normalize(String.join(" ",
                nullToEmpty(product.getProductName()),
                nullToEmpty(product.getBrand()),
                nullToEmpty(product.getCategory()),
                nullToEmpty(product.getProductDescription()),
                nullToEmpty(product.getViscosity()),
                nullToEmpty(product.getSpecification()),
                nullToEmpty(product.getVolume())
        ));

        return searchableText.contains(normalizedKeyword);
    }

    private boolean isMatchedFuelType(Product product, String fuelType) {
        if (isBlank(fuelType)) {
            return true;
        }

        String normalizedFuelType = normalize(fuelType);
        String searchableText = normalize(String.join(" ",
                nullToEmpty(product.getProductName()),
                nullToEmpty(product.getProductDescription()),
                nullToEmpty(product.getSpecification())
        ));

        return switch (normalizedFuelType) {
            case "gasoline" -> searchableText.contains("gasoline") || searchableText.contains("가솔린");
            case "diesel" -> searchableText.contains("diesel") || searchableText.contains("디젤");
            case "hybrid" -> searchableText.contains("hybrid") || searchableText.contains("하이브리드");
            case "europe" -> searchableText.contains("acea") || searchableText.contains("유럽");
            default -> true;
        };
    }

    private boolean isMatchedViscosity(Product product, String viscosity) {
        if (isBlank(viscosity)) {
            return true;
        }

        return normalize(product.getViscosity()).equals(normalize(viscosity));
    }

    private boolean isMatchedStandard(Product product, String standard) {
        if (isBlank(standard)) {
            return true;
        }

        return normalize(product.getSpecification()).contains(normalize(standard));
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

    private String normalize(String value) {
        return nullToEmpty(value)
                .toLowerCase(Locale.ROOT)
                .replace(" ", "")
                .replace("-", "")
                .replace("/", "");
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

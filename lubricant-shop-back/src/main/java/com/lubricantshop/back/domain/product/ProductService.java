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
                .filter(product -> isMatchedKeyword(product, keyword))
                .filter(product -> isMatchedFuelType(product, fuelType))
                .filter(product -> isMatchedViscosity(product, viscosity))
                .filter(product -> isMatchedStandard(product, standard))
                .sorted(resolveSort(sort))
                .map(ProductResponse::from)
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

        return normalize(product.getCategory()).equals(normalize(category));
    }

    private boolean isMatchedSubCategory(Product product, String subCategory) {
        if (isBlank(subCategory)) {
            return true;
        }

        String normalizedSubCategory = normalize(subCategory);
        String productName = normalize(product.getProductName());
        String specification = normalize(product.getSpecification());
        String viscosity = normalize(product.getViscosity());

        return viscosity.equals(normalizedSubCategory)
                || specification.contains(normalizedSubCategory)
                || productName.contains(normalizedSubCategory);
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
                .comparing(Product::getMainProduct, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Product::getRecommended, Comparator.nullsLast(Comparator.reverseOrder()))
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

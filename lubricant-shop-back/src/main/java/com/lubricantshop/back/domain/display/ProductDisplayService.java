package com.lubricantshop.back.domain.display;

import com.lubricantshop.back.domain.display.dto.ProductDisplaySectionResponse;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.domain.product.dto.ProductResponse;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductDisplayService {

    private final ProductDisplaySectionRepository sectionRepository;
    private final ProductDisplayItemRepository itemRepository;

    public ProductDisplayService(
            ProductDisplaySectionRepository sectionRepository,
            ProductDisplayItemRepository itemRepository
    ) {
        this.sectionRepository = sectionRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDisplaySectionResponse> findActiveSections() {
        List<ProductDisplaySection> sections = sectionRepository.findByActiveTrueOrderByDisplayOrderAscSectionIdAsc();
        Map<Long, ProductDisplaySectionResponseBuilder> responseBySectionId = new LinkedHashMap<>();

        sections.forEach(section -> responseBySectionId.put(
                section.getSectionId(),
                new ProductDisplaySectionResponseBuilder(section)
        ));

        LocalDateTime now = LocalDateTime.now();
        itemRepository.findBySectionInOrderBySection_DisplayOrderAscDisplayOrderAscItemIdAsc(sections)
                .stream()
                .filter(item -> item.isDisplayable(now))
                .filter(item -> isDisplayableProduct(item.getProduct()))
                .forEach(item -> responseBySectionId
                        .get(item.getSection().getSectionId())
                        .addProduct(ProductResponse.from(item.getProduct()))
                );

        return responseBySectionId.values().stream()
                .map(ProductDisplaySectionResponseBuilder::build)
                .toList();
    }

    private boolean isDisplayableProduct(Product product) {
        return product.getSaleStatus() == ProductStatus.ON_SALE
                && !Boolean.TRUE.equals(product.isDeleted());
    }

    private static class ProductDisplaySectionResponseBuilder {

        private final ProductDisplaySection section;
        private final java.util.ArrayList<ProductResponse> products = new java.util.ArrayList<>();

        ProductDisplaySectionResponseBuilder(ProductDisplaySection section) {
            this.section = section;
        }

        void addProduct(ProductResponse product) {
            products.add(product);
        }

        ProductDisplaySectionResponse build() {
            return new ProductDisplaySectionResponse(
                    section.getSectionId(),
                    section.getSectionCode(),
                    section.getSectionName(),
                    section.getDisplayOrder(),
                    List.copyOf(products)
            );
        }
    }
}

package com.lubricantshop.back.domain.display;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDisplayItemRepository extends JpaRepository<ProductDisplayItem, Long> {

    @EntityGraph(attributePaths = {"section", "product"})
    List<ProductDisplayItem> findBySectionInOrderBySection_DisplayOrderAscDisplayOrderAscItemIdAsc(
            List<ProductDisplaySection> sections
    );
}

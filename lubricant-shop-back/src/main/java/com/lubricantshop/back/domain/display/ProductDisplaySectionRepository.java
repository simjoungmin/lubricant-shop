package com.lubricantshop.back.domain.display;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDisplaySectionRepository extends JpaRepository<ProductDisplaySection, Long> {

    List<ProductDisplaySection> findByActiveTrueOrderByDisplayOrderAscSectionIdAsc();

    Optional<ProductDisplaySection> findBySectionCode(String sectionCode);
}

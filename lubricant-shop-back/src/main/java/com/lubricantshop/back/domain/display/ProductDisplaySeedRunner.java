package com.lubricantshop.back.domain.display;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ProductDisplaySeedRunner implements CommandLineRunner {

    private final ProductDisplaySectionRepository sectionRepository;

    public ProductDisplaySeedRunner(ProductDisplaySectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        createSectionIfAbsent("HOT", "HOT 상품", 1);
        createSectionIfAbsent("BEST", "BEST 상품", 2);
    }

    private void createSectionIfAbsent(String sectionCode, String sectionName, int displayOrder) {
        sectionRepository.findBySectionCode(sectionCode)
                .orElseGet(() -> sectionRepository.save(
                        new ProductDisplaySection(sectionCode, sectionName, true, displayOrder)
                ));
    }
}

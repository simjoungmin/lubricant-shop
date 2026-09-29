package com.lubricantshop.back.domain.product;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.verify;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository);
    }

    @Test
    void productSearchUsesExactSubCategorySlug() {
        doReturn(List.of()).when(productRepository).searchOnSaleProducts(
                any(ProductStatus.class),
                anyBoolean(),
                anyList(),
                anyBoolean(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString()
        );

        productService.findProducts(
                "engine",
                "racing-bike-engine-oil",
                null,
                null,
                null,
                null,
                null,
                "popular"
        );

        verify(productRepository).searchOnSaleProducts(
                eq(ProductStatus.ON_SALE),
                eq(true),
                eq(List.of("engine")),
                eq(true),
                eq(false),
                eq("racingbikeengineoil"),
                eq(false),
                eq(""),
                eq(false),
                eq("%%"),
                eq(false),
                eq(""),
                eq(false),
                eq(""),
                eq(false),
                eq("%%")
        );
    }

    @Test
    void brandEngineOilSearchUsesBrandSubCategoryException() {
        doReturn(List.of()).when(productRepository).searchOnSaleProducts(
                any(ProductStatus.class),
                anyBoolean(),
                anyList(),
                anyBoolean(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString(),
                anyBoolean(),
                anyString()
        );

        productService.findProducts(
                "engine",
                "brand-engine-oil",
                "SK 지크",
                null,
                null,
                null,
                null,
                "popular"
        );

        verify(productRepository).searchOnSaleProducts(
                eq(ProductStatus.ON_SALE),
                eq(true),
                eq(List.of("engine")),
                eq(true),
                eq(true),
                eq("brandengineoil"),
                eq(true),
                eq("sk지크"),
                eq(false),
                eq("%%"),
                eq(false),
                eq(""),
                eq(false),
                eq(""),
                eq(false),
                eq("%%")
        );
    }
}

package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.product.dto.ProductResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> findProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false, name = "q") String keyword,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String viscosity,
            @RequestParam(required = false) String standard,
            @RequestParam(required = false, defaultValue = "popular") String sort
    ) {
        return productService.findProducts(category, subCategory, keyword, fuelType, viscosity, standard, sort);
    }

    @GetMapping("/{productId}")
    public ProductResponse findProduct(@PathVariable Long productId) {
        return productService.findProduct(productId);
    }
}

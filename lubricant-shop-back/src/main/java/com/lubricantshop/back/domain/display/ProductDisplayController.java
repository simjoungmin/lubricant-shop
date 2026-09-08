package com.lubricantshop.back.domain.display;

import com.lubricantshop.back.domain.display.dto.ProductDisplaySectionResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/display-sections")
public class ProductDisplayController {

    private final ProductDisplayService productDisplayService;

    public ProductDisplayController(ProductDisplayService productDisplayService) {
        this.productDisplayService = productDisplayService;
    }

    @GetMapping
    public List<ProductDisplaySectionResponse> findActiveSections() {
        return productDisplayService.findActiveSections();
    }
}

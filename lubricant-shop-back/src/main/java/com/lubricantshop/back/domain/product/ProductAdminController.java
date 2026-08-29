package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.product.dto.AdminProductResponse;
import com.lubricantshop.back.domain.product.dto.AdminProductUpdateRequest;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/products")
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    public ProductAdminController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @GetMapping
    public List<AdminProductResponse> findProducts(
            @AuthenticationPrincipal AuthenticatedMember admin
    ) {
        return productAdminService.findProducts(admin.memberId());
    }

    @GetMapping("/{productId}")
    public AdminProductResponse findProduct(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long productId
    ) {
        return productAdminService.findProduct(admin.memberId(), productId);
    }

    @PatchMapping("/{productId}")
    public AdminProductResponse updateProduct(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long productId,
            @Valid @RequestBody AdminProductUpdateRequest request
    ) {
        return productAdminService.updateProduct(admin.memberId(), productId, request);
    }
}

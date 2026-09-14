package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.member.service.AdminAuthorizationService;
import com.lubricantshop.back.domain.product.dto.AdminProductResponse;
import com.lubricantshop.back.domain.product.dto.AdminProductUpdateRequest;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductAdminService {

    private static final String ADMIN_PRODUCTS_FORBIDDEN_MESSAGE = "관리자만 상품을 관리할 수 있습니다.";

    private final ProductRepository productRepository;
    private final AdminAuthorizationService adminAuthorizationService;

    public ProductAdminService(
            ProductRepository productRepository,
            AdminAuthorizationService adminAuthorizationService
    ) {
        this.productRepository = productRepository;
        this.adminAuthorizationService = adminAuthorizationService;
    }

    @Transactional(readOnly = true)
    public List<AdminProductResponse> findProducts(Long adminId) {
        adminAuthorizationService.requireAdmin(adminId, ADMIN_PRODUCTS_FORBIDDEN_MESSAGE);

        return productRepository.findByDeletedFalseOrderByProductIdAsc().stream()
                .map(AdminProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProductResponse findProduct(Long adminId, Long productId) {
        adminAuthorizationService.requireAdmin(adminId, ADMIN_PRODUCTS_FORBIDDEN_MESSAGE);

        Product product = productRepository.findById(productId)
                .filter(foundProduct -> !Boolean.TRUE.equals(foundProduct.isDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 상품입니다."));

        return AdminProductResponse.from(product);
    }

    @Transactional
    public AdminProductResponse updateProduct(Long adminId, Long productId, AdminProductUpdateRequest request) {
        adminAuthorizationService.requireAdmin(adminId, ADMIN_PRODUCTS_FORBIDDEN_MESSAGE);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 상품입니다."));

        product.updateAdminInfo(
                request.productName(),
                request.category(),
                request.subCategory(),
                request.brand(),
                request.price(),
                request.discountPrice(),
                request.stock(),
                request.productDescription(),
                request.viscosity(),
                request.specification(),
                request.volume(),
                request.imageUrl(),
                request.saleStatus(),
                request.pointRewardRatePercent()
        );

        return AdminProductResponse.from(product);
    }
}

package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.product.dto.AdminProductResponse;
import com.lubricantshop.back.domain.product.dto.AdminProductUpdateRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductAdminService {

    private final ProductRepository productRepository;

    public ProductAdminService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminProductResponse> findProducts() {
        return productRepository.findByDeletedFalseOrderByProductIdAsc().stream()
                .map(AdminProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProductResponse findProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .filter(foundProduct -> !Boolean.TRUE.equals(foundProduct.isDeleted()))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        return AdminProductResponse.from(product);
    }

    @Transactional
    public AdminProductResponse updateProduct(Long productId, AdminProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        product.updateAdminInfo(
                request.productName(),
                request.category(),
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
                request.pointRewardRatePercent(),
                request.mainProduct(),
                request.recommended()
        );

        return AdminProductResponse.from(product);
    }
}

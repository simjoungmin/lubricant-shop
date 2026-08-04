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

    @Transactional
    public AdminProductResponse updateProduct(Long productId, AdminProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        product.changeStock(request.stock());
        product.changeSaleStatus(request.saleStatus());

        return AdminProductResponse.from(product);
    }
}

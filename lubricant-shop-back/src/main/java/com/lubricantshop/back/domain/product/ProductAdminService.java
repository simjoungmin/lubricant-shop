package com.lubricantshop.back.domain.product;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.product.dto.AdminProductResponse;
import com.lubricantshop.back.domain.product.dto.AdminProductUpdateRequest;
import com.lubricantshop.back.global.exception.ForbiddenException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductAdminService {

    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;

    public ProductAdminService(ProductRepository productRepository, MemberRepository memberRepository) {
        this.productRepository = productRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminProductResponse> findProducts(Long adminId) {
        requireAdmin(adminId);

        return productRepository.findByDeletedFalseOrderByProductIdAsc().stream()
                .map(AdminProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminProductResponse findProduct(Long adminId, Long productId) {
        requireAdmin(adminId);

        Product product = productRepository.findById(productId)
                .filter(foundProduct -> !Boolean.TRUE.equals(foundProduct.isDeleted()))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        return AdminProductResponse.from(product);
    }

    @Transactional
    public AdminProductResponse updateProduct(Long adminId, Long productId, AdminProductUpdateRequest request) {
        requireAdmin(adminId);

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

    private void requireAdmin(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        if (member.getRole() != MemberRole.ADMIN) {
            throw new ForbiddenException("관리자만 상품을 관리할 수 있습니다.");
        }
    }
}

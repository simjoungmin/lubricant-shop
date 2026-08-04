package com.lubricantshop.back.domain.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByMember_MemberIdOrderByCartIdAsc(Long memberId);

    Optional<Cart> findByMember_MemberIdAndProduct_ProductId(Long memberId, Long productId);

    void deleteByCartIdAndMember_MemberId(Long cartId, Long memberId);

    void deleteByMember_MemberId(Long memberId);
}

package com.lubricantshop.back.domain.order;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByOrderedAtDesc();

    List<Order> findByMember_MemberIdOrderByOrderedAtDesc(Long memberId);

    Optional<Order> findByOrderIdAndMember_MemberId(Long orderId, Long memberId);
}

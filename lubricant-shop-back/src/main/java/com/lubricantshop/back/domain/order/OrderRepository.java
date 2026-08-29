package com.lubricantshop.back.domain.order;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByOrderedAtDesc();

    List<Order> findByMember_MemberIdOrderByOrderedAtDesc(Long memberId);

    Optional<Order> findByOrderIdAndMember_MemberId(Long orderId, Long memberId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Order o where o.orderId = :orderId")
    Optional<Order> findByOrderIdForUpdate(@Param("orderId") Long orderId);
}

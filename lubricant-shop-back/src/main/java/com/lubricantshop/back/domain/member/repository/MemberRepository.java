package com.lubricantshop.back.domain.member.repository;

import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.entity.Member;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByLoginIdIgnoreCase(String loginId);

    Optional<Member> findByEmailIgnoreCase(String email);

    Optional<Member> findByLoginIdIgnoreCase(String loginId);

    Optional<Member> findByProviderAndProviderId(SocialProvider provider, String providerId);

    Optional<Member> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    List<Member> findByWithdrawnTrueAndWithdrawalFinalizedAtIsNullAndWithdrawnAtLessThanEqual(
            LocalDateTime withdrawnAt
    );
}

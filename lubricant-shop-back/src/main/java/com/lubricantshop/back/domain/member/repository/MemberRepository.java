package com.lubricantshop.back.domain.member.repository;

import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<Member> findByEmailIgnoreCase(String email);

    Optional<Member> findByProviderAndProviderId(SocialProvider provider, String providerId);

    Optional<Member> findByPhoneNumber(String phoneNumber);
}

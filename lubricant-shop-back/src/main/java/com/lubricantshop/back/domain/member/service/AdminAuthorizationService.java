package com.lubricantshop.back.domain.member.service;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.ForbiddenException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAuthorizationService {

    private final MemberRepository memberRepository;

    public AdminAuthorizationService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public Member requireAdmin(Long memberId, String forbiddenMessage) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        if (member.getRole() != MemberRole.ADMIN) {
            throw new ForbiddenException(forbiddenMessage);
        }

        return member;
    }
}

package com.lubricantshop.back.domain.member.service.auth;

import com.lubricantshop.back.domain.member.dto.auth.MemberLoginRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberAuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberAuthService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public MemberLoginResponse login(MemberLoginRequest request) {
        String email = request.email().trim().toLowerCase();
        Member member = memberRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return toLoginResponse(member);
    }

    @Transactional(readOnly = true)
    public MemberLoginResponse findLoggedInMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        return toLoginResponse(member);
    }

    private MemberLoginResponse toLoginResponse(Member member) {
        return new MemberLoginResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getMemberName(),
                member.getProvider(),
                member.getRole(),
                member.getPointBalance()
        );
    }
}

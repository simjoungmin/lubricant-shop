package com.lubricantshop.back.domain.member.service.signup;

import com.lubricantshop.back.domain.member.dto.signup.MemberSignupRequest;
import com.lubricantshop.back.domain.member.dto.signup.MemberSignupResponse;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberSignupService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberSignupService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public boolean isEmailDuplicated(String email) {
        return memberRepository.existsByEmailIgnoreCase(email.trim());
    }

    @Transactional
    public MemberSignupResponse signup(MemberSignupRequest request) {
        String email = request.email().trim().toLowerCase();
        String loginId = request.loginId().trim().toLowerCase();

        if (memberRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (memberRepository.existsByLoginIdIgnoreCase(loginId)) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        Member member = new Member(
                email,
                loginId,
                passwordEncoder.encode(request.password()),
                request.name().trim(),
                normalizePhone(request.phone()),
                request.address() == null ? "" : request.address().trim(),
                request.termsAgreed(),
                request.privacyAgreed(),
                request.marketingAgreed(),
                request.vehicleInfo() == null ? "" : request.vehicleInfo().trim()
        );

        Member savedMember = memberRepository.save(member);
        return new MemberSignupResponse(
                savedMember.getMemberId(),
                savedMember.getEmail(),
                savedMember.getLoginId(),
                savedMember.getMemberName(),
                savedMember.getProvider(),
                savedMember.getRole(),
                savedMember.getPointBalance()
        );
    }

    private String normalizePhone(String phone) {
        return phone.trim().replace("-", "");
    }
}

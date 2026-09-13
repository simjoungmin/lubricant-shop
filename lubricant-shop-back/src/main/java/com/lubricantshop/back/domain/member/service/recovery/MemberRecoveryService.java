package com.lubricantshop.back.domain.member.service.recovery;

import com.lubricantshop.back.domain.member.dto.recovery.FindEmailResponse;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordResetRequest;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationMethod;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationResponse;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.member.service.verification.PasswordVerificationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberRecoveryService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordVerificationService passwordVerificationService;

    public MemberRecoveryService(
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            PasswordVerificationService passwordVerificationService
    ) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordVerificationService = passwordVerificationService;
    }

    @Transactional(readOnly = true)
    public FindEmailResponse findEmailByPhone(String phone) {
        Member member = memberRepository.findByPhoneNumber(normalizePhone(phone))
                .orElseThrow(() -> new IllegalArgumentException("입력한 휴대폰 번호로 가입된 계정이 없습니다."));

        return new FindEmailResponse(member.getLoginId());
    }

    @Transactional(readOnly = true)
    public PasswordVerificationResponse sendPasswordVerificationCode(
            String email,
            PasswordVerificationMethod method
    ) {
        Member member = memberRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("입력한 이메일로 가입된 계정이 없습니다."));

        String receiver = method == PasswordVerificationMethod.EMAIL ? member.getEmail() : member.getPhoneNumber();
        String code = passwordVerificationService.createCode(member.getEmail(), method, receiver);
        String message = method == PasswordVerificationMethod.EMAIL
                ? "이메일로 인증번호를 발송했습니다."
                : "가입된 휴대폰 번호로 인증번호를 발송했습니다.";

        return new PasswordVerificationResponse(message, code);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        String email = request.email().trim().toLowerCase();
        Member member = memberRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("입력한 이메일로 가입된 계정이 없습니다."));

        if (!request.newPassword().equals(request.newPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }

        if (passwordEncoder.matches(request.newPassword(), member.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
        }

        if (!passwordVerificationService.verifyAndConsume(email, request.code().trim())) {
            throw new IllegalArgumentException("인증번호가 올바르지 않거나 만료되었습니다.");
        }

        member.changePassword(passwordEncoder.encode(request.newPassword()));
    }

    private String normalizePhone(String phone) {
        return phone.trim().replace("-", "");
    }
}

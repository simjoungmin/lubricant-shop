package com.lubricantshop.back.domain.member.service.recovery;

import com.lubricantshop.back.domain.member.dto.recovery.FindEmailResponse;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordResetRequest;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationResponse;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.member.service.verification.PasswordVerificationService;
import com.lubricantshop.back.global.exception.BadRequestException;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import com.lubricantshop.back.global.sms.SmsClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberRecoveryService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordVerificationService passwordVerificationService;
    private final SmsClient smsClient;

    public MemberRecoveryService(
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            PasswordVerificationService passwordVerificationService,
            SmsClient smsClient
    ) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordVerificationService = passwordVerificationService;
        this.smsClient = smsClient;
    }

    @Transactional(readOnly = true)
    public FindEmailResponse findEmailByPhone(String phone) {
        Member member = memberRepository.findByPhoneNumber(normalizePhone(phone))
                .orElseThrow(() -> new ResourceNotFoundException("입력한 휴대폰 번호로 가입된 계정이 없습니다."));

        return new FindEmailResponse(member.getLoginId());
    }

    @Transactional(readOnly = true)
    public PasswordVerificationResponse sendPasswordVerificationCode(
            String email,
            String phone
    ) {
        Member member = memberRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new ResourceNotFoundException("입력한 정보와 일치하는 계정을 찾을 수 없습니다."));

        if (!normalizePhone(member.getPhoneNumber()).equals(normalizePhone(phone))) {
            throw new ResourceNotFoundException("입력한 정보와 일치하는 계정을 찾을 수 없습니다.");
        }

        String code = passwordVerificationService.createCode(member.getEmail());
        try {
            smsClient.sendPasswordVerificationCode(member.getPhoneNumber(), code);
        } catch (RuntimeException exception) {
            passwordVerificationService.discard(member.getEmail());
            throw exception;
        }

        return new PasswordVerificationResponse("가입된 휴대폰 번호로 인증번호를 발송했습니다.");
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        String email = normalizeEmail(request.email());
        Member member = memberRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("입력한 이메일로 가입된 계정이 없습니다."));

        if (!request.newPassword().equals(request.newPasswordConfirm())) {
            throw new BadRequestException("새 비밀번호가 일치하지 않습니다.");
        }

        if (passwordEncoder.matches(request.newPassword(), member.getPassword())) {
            throw new BadRequestException("기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
        }

        if (!passwordVerificationService.verifyAndConsume(email, request.code().trim())) {
            throw new BadRequestException("인증번호가 올바르지 않거나 만료되었습니다.");
        }

        member.changePassword(passwordEncoder.encode(request.newPassword()));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String normalizePhone(String phone) {
        return phone.trim().replaceAll("[^0-9]", "");
    }
}

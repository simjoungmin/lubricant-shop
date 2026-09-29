package com.lubricantshop.back.domain.member.controller;

import com.lubricantshop.back.domain.member.dto.signup.EmailCheckResponse;
import com.lubricantshop.back.domain.member.dto.signup.MemberSignupRequest;
import com.lubricantshop.back.domain.member.dto.signup.MemberSignupResponse;
import com.lubricantshop.back.domain.member.dto.signup.PhoneVerificationCodeRequest;
import com.lubricantshop.back.domain.member.dto.signup.PhoneVerificationCodeResponse;
import com.lubricantshop.back.domain.member.dto.signup.PhoneVerificationConfirmRequest;
import com.lubricantshop.back.domain.member.dto.signup.PhoneVerificationConfirmResponse;
import com.lubricantshop.back.domain.member.service.signup.MemberSignupService;
import com.lubricantshop.back.domain.member.service.verification.SignupPhoneVerificationService;
import com.lubricantshop.back.global.exception.ConflictException;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberSignupController {

    private final MemberSignupService memberSignupService;
    private final SignupPhoneVerificationService signupPhoneVerificationService;

    public MemberSignupController(
            MemberSignupService memberSignupService,
            SignupPhoneVerificationService signupPhoneVerificationService
    ) {
        this.memberSignupService = memberSignupService;
        this.signupPhoneVerificationService = signupPhoneVerificationService;
    }

    @GetMapping("/email-exists")
    public EmailCheckResponse checkEmail(@RequestParam String email) {
        return new EmailCheckResponse(memberSignupService.isEmailDuplicated(email));
    }

    @PostMapping("/signup")
    public MemberSignupResponse signup(@Valid @RequestBody MemberSignupRequest request) {
        return memberSignupService.signup(request);
    }

    @PostMapping("/signup/phone-verification-code")
    public PhoneVerificationCodeResponse sendPhoneVerificationCode(
            @Valid @RequestBody PhoneVerificationCodeRequest request
    ) {
        if (memberSignupService.isPhoneDuplicated(request.phone())) {
            throw new ConflictException("이미 가입된 휴대폰 번호입니다.");
        }

        signupPhoneVerificationService.sendCode(request.phone());
        return new PhoneVerificationCodeResponse("인증번호를 문자로 발송했습니다.");
    }

    @PostMapping("/signup/phone-verification")
    public PhoneVerificationConfirmResponse confirmPhoneVerification(
            @Valid @RequestBody PhoneVerificationConfirmRequest request
    ) {
        return signupPhoneVerificationService.confirmCode(request.phone(), request.code());
    }
}

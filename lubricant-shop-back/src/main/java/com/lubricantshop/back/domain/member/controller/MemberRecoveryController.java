package com.lubricantshop.back.domain.member.controller;

import com.lubricantshop.back.domain.member.dto.common.SimpleMessageResponse;
import com.lubricantshop.back.domain.member.dto.recovery.FindEmailRequest;
import com.lubricantshop.back.domain.member.dto.recovery.FindEmailResponse;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordResetRequest;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationRequest;
import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationResponse;
import com.lubricantshop.back.domain.member.service.recovery.MemberRecoveryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberRecoveryController {

    private final MemberRecoveryService memberRecoveryService;

    public MemberRecoveryController(MemberRecoveryService memberRecoveryService) {
        this.memberRecoveryService = memberRecoveryService;
    }

    @PostMapping("/find-email")
    public FindEmailResponse findEmail(@Valid @RequestBody FindEmailRequest request) {
        return memberRecoveryService.findEmailByPhone(request.phone());
    }

    @PostMapping("/password/verification-code")
    public PasswordVerificationResponse sendPasswordVerificationCode(
            @Valid @RequestBody PasswordVerificationRequest request
    ) {
        return memberRecoveryService.sendPasswordVerificationCode(request.email(), request.method());
    }

    @PostMapping("/password/reset")
    public SimpleMessageResponse resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        memberRecoveryService.resetPassword(request);
        return new SimpleMessageResponse("비밀번호가 변경되었습니다.");
    }
}

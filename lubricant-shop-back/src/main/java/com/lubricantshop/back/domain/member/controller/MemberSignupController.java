package com.lubricantshop.back.domain.member.controller;

import com.lubricantshop.back.domain.member.dto.signup.EmailCheckResponse;
import com.lubricantshop.back.domain.member.dto.signup.MemberSignupRequest;
import com.lubricantshop.back.domain.member.dto.signup.MemberSignupResponse;
import com.lubricantshop.back.domain.member.service.signup.MemberSignupService;
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

    public MemberSignupController(MemberSignupService memberSignupService) {
        this.memberSignupService = memberSignupService;
    }

    @GetMapping("/email-exists")
    public EmailCheckResponse checkEmail(@RequestParam String email) {
        return new EmailCheckResponse(memberSignupService.isEmailDuplicated(email));
    }

    @PostMapping("/signup")
    public MemberSignupResponse signup(@Valid @RequestBody MemberSignupRequest request) {
        return memberSignupService.signup(request);
    }
}

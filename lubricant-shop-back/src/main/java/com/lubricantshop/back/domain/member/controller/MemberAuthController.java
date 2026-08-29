package com.lubricantshop.back.domain.member.controller;

import com.lubricantshop.back.domain.member.dto.auth.MemberLoginRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.service.auth.MemberAuthService;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import com.lubricantshop.back.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberAuthController {

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    private final MemberAuthService memberAuthService;
    private final JwtTokenProvider jwtTokenProvider;
    private final boolean secureCookie;

    public MemberAuthController(
            MemberAuthService memberAuthService,
            JwtTokenProvider jwtTokenProvider,
            @Value("${app.cookie.secure:false}") boolean secureCookie
    ) {
        this.memberAuthService = memberAuthService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.secureCookie = secureCookie;
    }

    @PostMapping("/login")
    public MemberLoginResponse login(
            @Valid @RequestBody MemberLoginRequest request,
            HttpServletResponse response
    ) {
        MemberLoginResponse loginMember = memberAuthService.login(request);
        String accessToken = jwtTokenProvider.createAccessToken(loginMember);
        addAccessTokenCookie(response, accessToken, jwtTokenProvider.getAccessTokenValidity());
        return loginMember;
    }

    @GetMapping("/me")
    public MemberLoginResponse me(
            @AuthenticationPrincipal AuthenticatedMember member
    ) {
        return memberAuthService.findLoggedInMember(member.memberId());
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        addAccessTokenCookie(response, "", Duration.ZERO);
    }

    private void addAccessTokenCookie(HttpServletResponse response, String token, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

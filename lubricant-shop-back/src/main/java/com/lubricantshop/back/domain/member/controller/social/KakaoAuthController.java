package com.lubricantshop.back.domain.member.controller.social;

import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.service.social.kakao.KakaoLoginService;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import com.lubricantshop.back.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    private static final String KAKAO_STATE_COOKIE_NAME = "kakao_oauth_state";
    private static final Duration STATE_COOKIE_MAX_AGE = Duration.ofMinutes(5);

    private final KakaoLoginService kakaoLoginService;
    private final JwtTokenProvider jwtTokenProvider;
    private final boolean secureCookie;

    public KakaoAuthController(
            KakaoLoginService kakaoLoginService,
            JwtTokenProvider jwtTokenProvider,
            @Value("${app.cookie.secure:false}") boolean secureCookie
    ) {
        this.kakaoLoginService = kakaoLoginService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.secureCookie = secureCookie;
    }

    @GetMapping("/login")
    public ResponseEntity<Void> login(HttpServletResponse response) {
        String state = UUID.randomUUID().toString();
        addCookie(response, KAKAO_STATE_COOKIE_NAME, state, STATE_COOKIE_MAX_AGE);

        return ResponseEntity.status(302)
                .location(URI.create(kakaoLoginService.buildAuthorizeUrl(state)))
                .build();
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @CookieValue(name = KAKAO_STATE_COOKIE_NAME, required = false) String savedState,
            HttpServletResponse response
    ) {
        if (code == null || code.isBlank()) {
            throw new UnauthorizedException("카카오 인증 코드가 없습니다.");
        }

        if (state == null || savedState == null || !state.equals(savedState)) {
            throw new UnauthorizedException("카카오 로그인 요청이 유효하지 않습니다.");
        }

        MemberLoginResponse loginMember = kakaoLoginService.login(code);
        String accessToken = jwtTokenProvider.createAccessToken(loginMember);
        addCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, jwtTokenProvider.getAccessTokenValidity());
        addCookie(response, KAKAO_STATE_COOKIE_NAME, "", Duration.ZERO);

        return ResponseEntity.status(302)
                .location(URI.create(kakaoLoginService.frontendRedirectUri()))
                .build();
    }

    private void addCookie(HttpServletResponse response, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

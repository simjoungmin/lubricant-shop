package com.lubricantshop.back.domain.member.service.social.kakao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KakaoOAuthProperties {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String frontendRedirectUri;

    public KakaoOAuthProperties(
            @Value("${oauth.kakao.client-id:}") String clientId,
            @Value("${oauth.kakao.client-secret:}") String clientSecret,
            @Value("${oauth.kakao.redirect-uri:http://localhost:8080/api/auth/kakao/callback}") String redirectUri,
            @Value("${oauth.login-success-redirect-uri:http://localhost:3000}") String frontendRedirectUri
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.frontendRedirectUri = frontendRedirectUri;
    }

    public String clientId() {
        return clientId;
    }

    public String clientSecret() {
        return clientSecret;
    }

    public String redirectUri() {
        return redirectUri;
    }

    public String frontendRedirectUri() {
        return frontendRedirectUri;
    }

    public boolean hasClientSecret() {
        return clientSecret != null && !clientSecret.isBlank();
    }

    public void validateConfigured() {
        if (clientId == null || clientId.isBlank()) {
            throw new IllegalStateException("카카오 REST API 키가 설정되지 않았습니다.");
        }
    }
}
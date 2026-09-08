package com.lubricantshop.back.domain.member.service.social.naver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NaverOAuthProperties {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String frontendRedirectUri;

    public NaverOAuthProperties(
            @Value("${oauth.naver.client-id:}") String clientId,
            @Value("${oauth.naver.client-secret:}") String clientSecret,
            @Value("${oauth.naver.redirect-uri:http://localhost:8080/api/auth/naver/callback}") String redirectUri,
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

    public void validateConfigured() {
        if (clientId == null || clientId.isBlank()) {
            throw new IllegalStateException("네이버 Client ID가 설정되지 않았습니다.");
        }

        if (clientSecret == null || clientSecret.isBlank()) {
            throw new IllegalStateException("네이버 Client Secret이 설정되지 않았습니다.");
        }
    }
}

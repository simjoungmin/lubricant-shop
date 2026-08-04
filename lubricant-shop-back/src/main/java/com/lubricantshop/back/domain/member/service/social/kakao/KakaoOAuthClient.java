package com.lubricantshop.back.domain.member.service.social.kakao;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lubricantshop.back.domain.member.dto.social.KakaoMemberProfile;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class KakaoOAuthClient {

    private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;
    private final KakaoOAuthProperties properties;

    public KakaoOAuthClient(ObjectMapper objectMapper, KakaoOAuthProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public KakaoMemberProfile fetchProfile(String code) {
        String accessToken = requestAccessToken(code);
        return requestProfile(accessToken);
    }

    private String requestAccessToken(String code) {
        StringBuilder form = new StringBuilder()
                .append("grant_type=authorization_code")
                .append("&client_id=").append(encode(properties.clientId()))
                .append("&redirect_uri=").append(encode(properties.redirectUri()))
                .append("&code=").append(encode(code));

        if (properties.hasClientSecret()) {
            form.append("&client_secret=").append(encode(properties.clientSecret()));
        }

        HttpRequest request = HttpRequest.newBuilder(URI.create(TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(form.toString()))
                .build();

        JsonNode body = send(request);
        JsonNode accessToken = body.get("access_token");
        if (accessToken == null || accessToken.asText().isBlank()) {
            throw new IllegalStateException("카카오 access token 응답을 확인할 수 없습니다.");
        }

        return accessToken.asText();
    }

    private KakaoMemberProfile requestProfile(String accessToken) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(USER_INFO_URL))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        JsonNode body = send(request);
        String providerId = body.path("id").asText("");
        JsonNode kakaoAccount = body.path("kakao_account");
        String email = kakaoAccount.path("email").asText("");
        String nickname = kakaoAccount.path("profile").path("nickname").asText("");

        if (providerId.isBlank()) {
            throw new IllegalStateException("카카오 사용자 ID를 확인할 수 없습니다.");
        }

        return new KakaoMemberProfile(providerId, email, nickname);
    }

    private JsonNode send(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            JsonNode body = objectMapper.readTree(response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("카카오 API 요청에 실패했습니다: " + body.path("error_description").asText(response.body()));
            }

            return body;
        } catch (IllegalStateException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("카카오 API 통신에 실패했습니다.", exception);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
package com.lubricantshop.back.domain.member.service.social.naver;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lubricantshop.back.domain.member.dto.social.NaverMemberProfile;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class NaverOAuthClient {

    private static final String TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
    private static final String USER_INFO_URL = "https://openapi.naver.com/v1/nid/me";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;
    private final NaverOAuthProperties properties;

    public NaverOAuthClient(ObjectMapper objectMapper, NaverOAuthProperties properties) {
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public NaverMemberProfile fetchProfile(String code, String state) {
        String accessToken = requestAccessToken(code, state);
        return requestProfile(accessToken);
    }

    private String requestAccessToken(String code, String state) {
        String form = new StringBuilder()
                .append("grant_type=authorization_code")
                .append("&client_id=").append(encode(properties.clientId()))
                .append("&client_secret=").append(encode(properties.clientSecret()))
                .append("&code=").append(encode(code))
                .append("&state=").append(encode(state))
                .toString();

        HttpRequest request = HttpRequest.newBuilder(URI.create(TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        JsonNode body = send(request);
        JsonNode accessToken = body.get("access_token");
        if (accessToken == null || accessToken.asText().isBlank()) {
            throw new IllegalStateException("네이버 access token 응답을 확인할 수 없습니다.");
        }

        return accessToken.asText();
    }

    private NaverMemberProfile requestProfile(String accessToken) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(USER_INFO_URL))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        JsonNode body = send(request);
        JsonNode response = body.path("response");
        String providerId = response.path("id").asText("");
        String email = response.path("email").asText("");
        String name = response.path("name").asText("");
        String nickname = response.path("nickname").asText("");

        if (providerId.isBlank()) {
            throw new IllegalStateException("네이버 사용자 ID를 확인할 수 없습니다.");
        }

        return new NaverMemberProfile(providerId, email, name, nickname);
    }

    private JsonNode send(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            JsonNode body = objectMapper.readTree(response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String message = body.path("error_description").asText(body.path("message").asText(response.body()));
                throw new IllegalStateException("네이버 API 요청에 실패했습니다: " + message);
            }

            return body;
        } catch (IllegalStateException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("네이버 API 통신에 실패했습니다.", exception);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}

package com.lubricantshop.back.global.security;

import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    private static final Pattern SUBJECT_PATTERN = Pattern.compile("\"sub\":\"(\\d+)\"");
    private static final Pattern EXPIRES_AT_PATTERN = Pattern.compile("\"exp\":(\\d+)");
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();

    private final byte[] secret;
    private final Duration accessTokenValidity;

    public JwtTokenProvider(
            @Value("${jwt.secret:oil-master-local-development-secret-key-change-me}") String secret,
            @Value("${jwt.access-token-validity-seconds:7200}") long accessTokenValiditySeconds
    ) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.accessTokenValidity = Duration.ofSeconds(accessTokenValiditySeconds);
    }

    public String createAccessToken(MemberLoginResponse member) {
        Instant now = Instant.now();
        String payloadJson = "{"
                + "\"sub\":\"" + member.memberId() + "\","
                + "\"email\":\"" + escapeJson(member.email()) + "\","
                + "\"name\":\"" + escapeJson(member.name()) + "\","
                + "\"iat\":" + now.getEpochSecond() + ","
                + "\"exp\":" + now.plus(accessTokenValidity).getEpochSecond()
                + "}";

        String unsignedToken = encode(HEADER_JSON) + "." + encode(payloadJson);
        return unsignedToken + "." + sign(unsignedToken);
    }

    public Long getMemberId(String token) {
        String payloadJson = parseAndValidate(token);
        Matcher subjectMatcher = SUBJECT_PATTERN.matcher(payloadJson);

        if (!subjectMatcher.find()) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        return Long.valueOf(subjectMatcher.group(1));
    }

    public Duration getAccessTokenValidity() {
        return accessTokenValidity;
    }

    private String parseAndValidate(String token) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        String payloadJson;
        try {
            payloadJson = new String(BASE64_URL_DECODER.decode(parts[1]), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException exception) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        Matcher expiresAtMatcher = EXPIRES_AT_PATTERN.matcher(payloadJson);
        if (!expiresAtMatcher.find()) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        long expiresAt = Long.parseLong(expiresAtMatcher.group(1));
        if (Instant.now().getEpochSecond() >= expiresAt) {
            throw new UnauthorizedException("로그인이 만료되었습니다.");
        }

        return payloadJson;
    }

    private String encode(String value) {
        return BASE64_URL_ENCODER.encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("JWT 서명에 실패했습니다.", exception);
        }
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}

package com.lubricantshop.back.global.sms;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SolapiSmsClient implements SmsClient {

    private static final String AUTH_METHOD = "HMAC-SHA256";
    private static final String DEFAULT_API_URL = "https://api.solapi.com/messages/v4/send-many/detail";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;
    private final boolean enabled;
    private final String apiKey;
    private final String apiSecret;
    private final String senderPhone;
    private final String apiUrl;

    public SolapiSmsClient(
            ObjectMapper objectMapper,
            @Value("${sms.enabled:false}") boolean enabled,
            @Value("${solapi.api-key:}") String apiKey,
            @Value("${solapi.api-secret:}") String apiSecret,
            @Value("${solapi.sender-phone:}") String senderPhone,
            @Value("${solapi.api-url:" + DEFAULT_API_URL + "}") String apiUrl
    ) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.senderPhone = senderPhone;
        this.apiUrl = apiUrl;
    }

    @Override
    public void sendPasswordVerificationCode(String phoneNumber, String code) {
        sendVerificationCode(
                phoneNumber,
                "[OIL MASTER] 비밀번호 재설정 인증번호는 " + code + "입니다. 5분 내 입력해 주세요."
        );
    }

    @Override
    public void sendSignupVerificationCode(String phoneNumber, String code) {
        sendVerificationCode(
                phoneNumber,
                "[OIL MASTER] 회원가입 인증번호는 " + code + "입니다. 5분 내 입력해 주세요."
        );
    }

    private void sendVerificationCode(String phoneNumber, String text) {
        validateConfigured();

        MessageRequest requestBody = new MessageRequest(
                List.of(new Message(normalizePhone(phoneNumber), normalizePhone(senderPhone), text, "SMS"))
        );

        try {
            String body = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder(URI.create(apiUrl))
                    .header("Authorization", createAuthorizationHeader())
                    .header("Content-Type", "application/json;charset=UTF-8")
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("인증번호 문자 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
            if (hasFailedMessage(response.body())) {
                throw new IllegalStateException("인증번호 문자 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
        } catch (IllegalStateException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("인증번호 문자 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.", exception);
        }
    }

    private void validateConfigured() {
        if (!enabled) {
            throw new IllegalStateException("SMS 발송 기능이 활성화되어 있지 않습니다.");
        }

        if (apiKey.isBlank() || apiSecret.isBlank() || senderPhone.isBlank()) {
            throw new IllegalStateException("SMS 발송 설정을 확인해 주세요.");
        }
    }

    private String createAuthorizationHeader() throws Exception {
        String dateTime = Instant.now().toString();
        String salt = UUID.randomUUID().toString().replace("-", "");
        String signature = generateSignature(dateTime, salt);

        return AUTH_METHOD
                + " apiKey=" + apiKey
                + ", date=" + dateTime
                + ", salt=" + salt
                + ", signature=" + signature;
    }

    private String generateSignature(String dateTime, String salt) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal((dateTime + salt).getBytes(StandardCharsets.UTF_8));

        return HexFormat.of().formatHex(hash);
    }

    private boolean hasFailedMessage(String responseBody) throws Exception {
        return objectMapper.readTree(responseBody)
                .path("failedMessageList")
                .elements()
                .hasNext();
    }

    private String normalizePhone(String phoneNumber) {
        return phoneNumber.trim().replaceAll("[^0-9]", "");
    }

    private record MessageRequest(List<Message> messages) {
    }

    private record Message(String to, String from, String text, String type) {
    }
}

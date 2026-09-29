package com.lubricantshop.back.domain.payment.toss;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lubricantshop.back.global.exception.BadRequestException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TossPaymentsClient {

    private static final String DEFAULT_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;
    private final String secretKey;
    private final String confirmUrl;

    public TossPaymentsClient(
            ObjectMapper objectMapper,
            @Value("${payments.toss.secret-key:}") String secretKey,
            @Value("${payments.toss.confirm-url:" + DEFAULT_CONFIRM_URL + "}") String confirmUrl
    ) {
        this.objectMapper = objectMapper;
        this.secretKey = secretKey;
        this.confirmUrl = confirmUrl;
    }

    public TossPaymentConfirmResponse confirm(TossPaymentConfirmRequest confirmRequest) {
        validateConfigured();

        try {
            String requestBody = objectMapper.writeValueAsString(confirmRequest);
            HttpRequest request = HttpRequest.newBuilder(URI.create(confirmUrl))
                    .header("Authorization", createAuthorizationHeader())
                    .header("Content-Type", "application/json")
                    .header("Idempotency-Key", confirmRequest.paymentKey())
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BadRequestException(resolveErrorMessage(response.body()));
            }

            JsonNode body = objectMapper.readTree(response.body());
            return new TossPaymentConfirmResponse(
                    body.path("paymentKey").asText(),
                    body.path("orderId").asText(),
                    body.path("totalAmount").asLong(),
                    body.path("method").asText(null),
                    body.path("status").asText(),
                    body.path("approvedAt").asText(null),
                    response.body()
            );
        } catch (BadRequestException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("토스페이먼츠 결제 승인 통신에 실패했습니다.", exception);
        }
    }

    private void validateConfigured() {
        if (secretKey.isBlank()) {
            throw new IllegalStateException("토스페이먼츠 시크릿 키 설정을 확인해 주세요.");
        }
    }

    private String createAuthorizationHeader() {
        String encodedKey = Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        return "Basic " + encodedKey;
    }

    private String resolveErrorMessage(String responseBody) {
        try {
            JsonNode body = objectMapper.readTree(responseBody);
            String message = body.path("message").asText("");
            if (!message.isBlank()) {
                return message;
            }
        } catch (Exception ignored) {
        }

        return "결제 승인에 실패했습니다. 결제 정보를 다시 확인해 주세요.";
    }
}

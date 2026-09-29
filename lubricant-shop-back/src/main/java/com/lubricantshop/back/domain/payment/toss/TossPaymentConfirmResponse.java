package com.lubricantshop.back.domain.payment.toss;

public record TossPaymentConfirmResponse(
        String paymentKey,
        String orderId,
        Long totalAmount,
        String method,
        String status,
        String approvedAt,
        String rawResponse
) {
}

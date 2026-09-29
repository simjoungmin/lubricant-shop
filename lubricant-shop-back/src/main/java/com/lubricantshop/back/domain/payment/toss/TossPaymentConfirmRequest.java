package com.lubricantshop.back.domain.payment.toss;

public record TossPaymentConfirmRequest(
        String paymentKey,
        String orderId,
        Long amount
) {
}

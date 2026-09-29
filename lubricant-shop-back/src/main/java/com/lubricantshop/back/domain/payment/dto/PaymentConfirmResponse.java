package com.lubricantshop.back.domain.payment.dto;

import com.lubricantshop.back.domain.order.Order;
import com.lubricantshop.back.domain.payment.Payment;
import java.math.BigDecimal;

public record PaymentConfirmResponse(
        Long orderId,
        String orderNumber,
        String orderStatus,
        BigDecimal paymentAmount,
        String paymentKey,
        String paymentMethod,
        String approvedAt
) {

    public static PaymentConfirmResponse from(Order order, Payment payment) {
        return new PaymentConfirmResponse(
                order.getOrderId(),
                order.getPgOrderId(),
                order.getOrderStatus().name(),
                order.getPaymentAmount(),
                payment.getPaymentKey(),
                payment.getMethod(),
                payment.getApprovedAt()
        );
    }
}

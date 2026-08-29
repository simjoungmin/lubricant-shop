package com.lubricantshop.back.domain.order.dto;

import java.math.BigDecimal;

public record OrderCreateResponse(
        Long orderId,
        String orderNumber,
        BigDecimal totalOrderAmount,
        BigDecimal paymentAmount,
        boolean pointUseConfirmed,
        Integer pointUsed,
        Integer pointEarned,
        Integer remainingPointBalance,
        String orderStatus,
        String paymentMethod
) {
}

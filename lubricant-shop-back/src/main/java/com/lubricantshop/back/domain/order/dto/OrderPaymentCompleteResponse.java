package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.Order;
import java.math.BigDecimal;

public record OrderPaymentCompleteResponse(
        Long orderId,
        String orderNumber,
        String orderStatus,
        BigDecimal paymentAmount,
        Integer pointUsed,
        Integer pointEarned,
        Integer remainingPointBalance
) {

    public static OrderPaymentCompleteResponse from(Order order) {
        return new OrderPaymentCompleteResponse(
                order.getOrderId(),
                "OM-" + String.format("%06d", order.getOrderId()),
                order.getOrderStatus().name(),
                order.getPaymentAmount(),
                order.getPointUsed(),
                order.getPointEarned(),
                order.getMember().getPointBalance()
        );
    }
}

package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.Order;
import com.lubricantshop.back.domain.order.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MyOrderSummaryResponse(
        Long orderId,
        String orderNumber,
        OrderStatus orderStatus,
        BigDecimal totalOrderAmount,
        BigDecimal paymentAmount,
        String representativeProductName,
        Integer itemCount,
        Integer totalQuantity,
        LocalDateTime orderedAt
) {
    public static MyOrderSummaryResponse from(Order order, List<MyOrderItemResponse> items) {
        int totalQuantity = items.stream()
                .mapToInt(MyOrderItemResponse::quantity)
                .sum();
        String representativeProductName = items.isEmpty() ? "주문 상품 없음" : items.get(0).productName();

        return new MyOrderSummaryResponse(
                order.getOrderId(),
                "OM-" + String.format("%06d", order.getOrderId()),
                order.getOrderStatus(),
                order.getTotalOrderAmount(),
                order.getPaymentAmount(),
                representativeProductName,
                items.size(),
                totalQuantity,
                order.getOrderedAt()
        );
    }
}

package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record AdminOrderStatusUpdateRequest(
        @NotNull OrderStatus orderStatus
) {
}

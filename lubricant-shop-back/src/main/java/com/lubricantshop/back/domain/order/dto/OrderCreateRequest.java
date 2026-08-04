package com.lubricantshop.back.domain.order.dto;

import com.lubricantshop.back.domain.order.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderCreateRequest(
        @NotEmpty List<@Valid OrderItemRequest> items,
        @NotBlank String shippingAddress,
        @NotNull PaymentMethod paymentMethod,
        @NotBlank String receiverName,
        @NotBlank String receiverPhone,
        String deliveryRequest,
        boolean usePoints,
        @Min(0) Integer pointAmount
) {
}

package com.lubricantshop.back.domain.order.dto;

import jakarta.validation.constraints.Size;

public record AdminOrderShipmentUpdateRequest(
        @Size(max = 80, message = "택배사는 80자 이하로 입력해주세요.")
        String courier,

        @Size(max = 100, message = "송장번호는 100자 이하로 입력해주세요.")
        String trackingNumber,

        @Size(max = 500, message = "배송 메모는 500자 이하로 입력해주세요.")
        String shipmentMemo
) {
}

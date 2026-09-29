package com.lubricantshop.back.domain.member.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberAddressUpdateRequest(
        @NotBlank(message = "주소를 입력해 주세요.")
        @Size(max = 500, message = "주소는 500자 이하로 입력해 주세요.")
        String address
) {
}

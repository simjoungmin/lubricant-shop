package com.lubricantshop.back.domain.member.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberNameUpdateRequest(
        @NotBlank(message = "이름을 입력해 주세요.")
        @Size(max = 80, message = "이름은 80자 이하로 입력해 주세요.")
        String name
) {
}

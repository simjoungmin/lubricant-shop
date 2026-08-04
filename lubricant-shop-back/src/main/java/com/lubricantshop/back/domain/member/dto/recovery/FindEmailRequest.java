package com.lubricantshop.back.domain.member.dto.recovery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record FindEmailRequest(
        @NotBlank(message = "휴대폰 번호를 입력해 주세요.")
        @Pattern(regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$", message = "휴대폰 번호 형식을 확인해 주세요.")
        String phone
) {
}

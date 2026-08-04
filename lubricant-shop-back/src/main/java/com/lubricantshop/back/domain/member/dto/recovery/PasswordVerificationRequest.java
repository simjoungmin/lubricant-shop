package com.lubricantshop.back.domain.member.dto.recovery;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PasswordVerificationRequest(
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해 주세요.")
        String email,

        @NotNull(message = "인증 방식을 선택해 주세요.")
        PasswordVerificationMethod method
) {
}

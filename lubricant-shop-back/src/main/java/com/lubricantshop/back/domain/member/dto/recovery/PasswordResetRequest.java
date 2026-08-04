package com.lubricantshop.back.domain.member.dto.recovery;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PasswordResetRequest(
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해 주세요.")
        String email,

        @NotBlank(message = "인증번호를 입력해 주세요.")
        String code,

        @NotBlank(message = "새 비밀번호를 입력해 주세요.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$",
                message = "비밀번호는 소문자, 대문자, 특수문자를 포함해 8자 이상이어야 합니다."
        )
        String newPassword,

        @NotBlank(message = "새 비밀번호를 한 번 더 입력해 주세요.")
        String newPasswordConfirm
) {
}

package com.lubricantshop.back.domain.member.dto.recovery;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordVerificationRequest(
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해 주세요.")
        String email,

        @NotBlank(message = "가입한 휴대폰 번호를 입력해 주세요.")
        String phone
) {
}

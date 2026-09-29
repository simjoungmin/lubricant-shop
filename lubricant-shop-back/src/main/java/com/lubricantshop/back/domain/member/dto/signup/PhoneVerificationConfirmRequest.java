package com.lubricantshop.back.domain.member.dto.signup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PhoneVerificationConfirmRequest(
        @NotBlank(message = "휴대폰 번호를 입력해 주세요.")
        @Pattern(regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$", message = "휴대폰 번호 형식을 확인해 주세요.")
        String phone,

        @NotBlank(message = "인증번호를 입력해 주세요.")
        @Pattern(regexp = "^\\d{6}$", message = "인증번호 6자리를 입력해 주세요.")
        String code
) {
}

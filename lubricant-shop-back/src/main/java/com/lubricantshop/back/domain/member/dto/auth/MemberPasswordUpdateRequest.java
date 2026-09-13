package com.lubricantshop.back.domain.member.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MemberPasswordUpdateRequest(
        @NotBlank(message = "현재 비밀번호를 입력해 주세요.")
        String currentPassword,

        @NotBlank(message = "새 비밀번호를 입력해 주세요.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$",
                message = "특수문자, 대문자, 소문자를 포함해 8자 이상 입력해 주세요."
        )
        String newPassword,

        @NotBlank(message = "새 비밀번호를 한 번 더 입력해 주세요.")
        String newPasswordConfirm
) {
}

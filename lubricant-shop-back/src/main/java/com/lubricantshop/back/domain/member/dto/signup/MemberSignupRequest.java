package com.lubricantshop.back.domain.member.dto.signup;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MemberSignupRequest(
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해 주세요.")
        String email,

        @NotBlank(message = "아이디를 입력해 주세요.")
        @Pattern(regexp = "^[a-z0-9]{4,16}$", message = "아이디는 영문소문자/숫자 4~16자로 입력해 주세요.")
        String loginId,

        @NotBlank(message = "비밀번호를 입력해 주세요.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$",
                message = "비밀번호는 소문자, 대문자, 특수문자를 포함해 8자 이상이어야 합니다."
        )
        String password,

        @NotBlank(message = "이름을 입력해 주세요.")
        @Size(max = 80, message = "이름은 80자 이하로 입력해 주세요.")
        String name,

        @Size(max = 500, message = "주소는 500자 이하로 입력해 주세요.")
        String address,

        @NotBlank(message = "휴대폰 번호를 입력해 주세요.")
        @Pattern(regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$", message = "휴대폰 번호 형식을 확인해 주세요.")
        String phone,

        @NotBlank(message = "휴대폰 인증을 완료해 주세요.")
        String phoneVerificationToken,

        @AssertTrue(message = "이용약관에 동의해 주세요.")
        boolean termsAgreed,

        @AssertTrue(message = "개인정보 수집 및 이용에 동의해 주세요.")
        boolean privacyAgreed,

        boolean marketingAgreed,

        @Size(max = 255, message = "차량 정보는 255자 이하로 입력해 주세요.")
        String vehicleInfo
) {
}

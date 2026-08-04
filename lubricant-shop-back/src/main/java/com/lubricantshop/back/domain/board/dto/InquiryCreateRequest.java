package com.lubricantshop.back.domain.board.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InquiryCreateRequest(
        @NotBlank(message = "문의 제목을 입력해주세요.")
        @Size(max = 200, message = "문의 제목은 200자 이하로 입력해주세요.")
        String title,

        @NotBlank(message = "문의 내용을 입력해주세요.")
        @Size(min = 10, message = "문의 내용은 10자 이상 입력해주세요.")
        String content,

        @NotBlank(message = "이름을 입력해주세요.")
        @Size(max = 80, message = "이름은 80자 이하로 입력해주세요.")
        String contactName,

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식으로 입력해주세요.")
        @Size(max = 160, message = "이메일은 160자 이하로 입력해주세요.")
        String contactEmail,

        @Size(max = 80, message = "문의 분류는 80자 이하로 입력해주세요.")
        String inquiryCategory,

        @Size(max = 80, message = "문의 그룹은 80자 이하로 입력해주세요.")
        String inquiryGroup,

        @Size(max = 120, message = "문의 항목은 120자 이하로 입력해주세요.")
        String inquiryTopic,

        @Size(max = 80, message = "주문번호는 80자 이하로 입력해주세요.")
        String orderNumber,

        @Size(max = 255, message = "차량 정보는 255자 이하로 입력해주세요.")
        String vehicleInfo
) {
}

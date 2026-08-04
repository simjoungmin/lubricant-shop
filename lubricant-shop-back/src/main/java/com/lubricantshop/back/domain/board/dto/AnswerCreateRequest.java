package com.lubricantshop.back.domain.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnswerCreateRequest(
        @NotBlank(message = "답변 내용을 입력해주세요.")
        @Size(min = 2, message = "답변 내용은 2자 이상 입력해주세요.")
        String content
) {
}

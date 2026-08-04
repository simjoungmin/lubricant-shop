package com.lubricantshop.back.domain.board.dto;

import java.util.List;

public record InquiryDetailResponse(
        InquiryResponse inquiry,
        List<AnswerResponse> answers
) {
}

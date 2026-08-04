package com.lubricantshop.back.domain.board.dto;

import com.lubricantshop.back.domain.board.BoardAnswer;
import java.time.LocalDateTime;

public record AnswerResponse(
        Long answerId,
        Long adminId,
        String adminName,
        String content,
        LocalDateTime createdAt
) {
    public static AnswerResponse from(BoardAnswer answer) {
        return new AnswerResponse(
                answer.getAnswerId(),
                answer.getAdmin().getMemberId(),
                answer.getAdmin().getMemberName(),
                answer.getContent(),
                answer.getCreatedAt()
        );
    }
}

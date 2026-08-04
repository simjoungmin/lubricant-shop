package com.lubricantshop.back.domain.board.dto;

import com.lubricantshop.back.domain.board.AnswerStatus;
import com.lubricantshop.back.domain.board.Board;
import java.time.LocalDateTime;

public record InquiryResponse(
        Long boardId,
        Long writerId,
        String writerName,
        String title,
        String content,
        AnswerStatus answerStatus,
        Boolean answerChecked,
        String inquiryCategory,
        String inquiryGroup,
        String inquiryTopic,
        String contactName,
        String contactEmail,
        String orderNumber,
        String vehicleInfo,
        LocalDateTime createdAt
) {
    public static InquiryResponse from(Board board) {
        return new InquiryResponse(
                board.getBoardId(),
                board.getWriter().getMemberId(),
                board.getWriter().getMemberName(),
                board.getTitle(),
                board.getContent(),
                board.getAnswerStatus(),
                board.getAnswerChecked(),
                board.getInquiryCategory(),
                board.getInquiryGroup(),
                board.getInquiryTopic(),
                board.getContactName(),
                board.getContactEmail(),
                board.getOrderNumber(),
                board.getVehicleInfo(),
                board.getCreatedAt()
        );
    }
}

package com.lubricantshop.back.domain.board.controller;

import com.lubricantshop.back.domain.board.dto.AnswerCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryDetailResponse;
import com.lubricantshop.back.domain.board.dto.InquiryResponse;
import com.lubricantshop.back.domain.board.dto.UnreadAnswerResponse;
import com.lubricantshop.back.domain.board.service.BoardInquiryService;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/boards")
public class BoardInquiryController {

    private final BoardInquiryService boardInquiryService;

    public BoardInquiryController(BoardInquiryService boardInquiryService) {
        this.boardInquiryService = boardInquiryService;
    }

    @PostMapping("/inquiries")
    public InquiryResponse createInquiry(
            @AuthenticationPrincipal AuthenticatedMember writer,
            @Valid @RequestBody InquiryCreateRequest request
    ) {
        return boardInquiryService.createInquiry(writer.memberId(), request);
    }

    @GetMapping("/admin/inquiries")
    public List<InquiryResponse> findAdminInquiries(
            @AuthenticationPrincipal AuthenticatedMember admin
    ) {
        return boardInquiryService.findAdminInquiries(admin.memberId());
    }

    @GetMapping("/admin/inquiries/{boardId}")
    public InquiryDetailResponse findAdminInquiry(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long boardId
    ) {
        return boardInquiryService.findAdminInquiry(admin.memberId(), boardId);
    }

    @PostMapping("/admin/inquiries/{boardId}/answers")
    public InquiryDetailResponse createAnswer(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long boardId,
            @Valid @RequestBody AnswerCreateRequest request
    ) {
        return boardInquiryService.createAnswer(admin.memberId(), boardId, request);
    }

    @GetMapping("/my/inquiries")
    public List<InquiryResponse> findMyInquiries(
            @AuthenticationPrincipal AuthenticatedMember writer
    ) {
        return boardInquiryService.findMyInquiries(writer.memberId());
    }

    @GetMapping("/my/inquiries/has-unread-answer")
    public UnreadAnswerResponse hasUnreadAnswer(
            @AuthenticationPrincipal AuthenticatedMember writer
    ) {
        return new UnreadAnswerResponse(boardInquiryService.hasUnreadAnswer(writer.memberId()));
    }

    @GetMapping("/my/inquiries/{boardId}")
    public InquiryDetailResponse findMyInquiry(
            @AuthenticationPrincipal AuthenticatedMember writer,
            @PathVariable Long boardId
    ) {
        return boardInquiryService.findMyInquiry(writer.memberId(), boardId);
    }

    @PostMapping("/my/inquiries/{boardId}/answer-checked")
    public InquiryDetailResponse markMyInquiryAnswerChecked(
            @AuthenticationPrincipal AuthenticatedMember writer,
            @PathVariable Long boardId
    ) {
        return boardInquiryService.markMyInquiryAnswerChecked(writer.memberId(), boardId);
    }

}

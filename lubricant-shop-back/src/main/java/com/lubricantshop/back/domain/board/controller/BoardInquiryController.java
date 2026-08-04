package com.lubricantshop.back.domain.board.controller;

import com.lubricantshop.back.domain.board.dto.AnswerCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryDetailResponse;
import com.lubricantshop.back.domain.board.dto.InquiryResponse;
import com.lubricantshop.back.domain.board.dto.UnreadAnswerResponse;
import com.lubricantshop.back.domain.board.service.BoardInquiryService;
import com.lubricantshop.back.global.security.JwtTokenProvider;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/boards")
public class BoardInquiryController {

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    private final BoardInquiryService boardInquiryService;
    private final JwtTokenProvider jwtTokenProvider;

    public BoardInquiryController(BoardInquiryService boardInquiryService, JwtTokenProvider jwtTokenProvider) {
        this.boardInquiryService = boardInquiryService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/inquiries")
    public InquiryResponse createInquiry(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @Valid @RequestBody InquiryCreateRequest request
    ) {
        Long writerId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.createInquiry(writerId, request);
    }

    @GetMapping("/admin/inquiries")
    public List<InquiryResponse> findAdminInquiries(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        Long adminId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.findAdminInquiries(adminId);
    }

    @GetMapping("/admin/inquiries/{boardId}")
    public InquiryDetailResponse findAdminInquiry(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long boardId
    ) {
        Long adminId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.findAdminInquiry(adminId, boardId);
    }

    @PostMapping("/admin/inquiries/{boardId}/answers")
    public InquiryDetailResponse createAnswer(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long boardId,
            @Valid @RequestBody AnswerCreateRequest request
    ) {
        Long adminId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.createAnswer(adminId, boardId, request);
    }

    @GetMapping("/my/inquiries")
    public List<InquiryResponse> findMyInquiries(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        Long writerId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.findMyInquiries(writerId);
    }

    @GetMapping("/my/inquiries/has-unread-answer")
    public UnreadAnswerResponse hasUnreadAnswer(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        Long writerId = jwtTokenProvider.getMemberId(accessToken);
        return new UnreadAnswerResponse(boardInquiryService.hasUnreadAnswer(writerId));
    }

    @GetMapping("/my/inquiries/{boardId}")
    public InquiryDetailResponse findMyInquiry(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long boardId
    ) {
        Long writerId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.findMyInquiry(writerId, boardId);
    }

    @PostMapping("/my/inquiries/{boardId}/answer-checked")
    public InquiryDetailResponse markMyInquiryAnswerChecked(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long boardId
    ) {
        Long writerId = jwtTokenProvider.getMemberId(accessToken);
        return boardInquiryService.markMyInquiryAnswerChecked(writerId, boardId);
    }

}

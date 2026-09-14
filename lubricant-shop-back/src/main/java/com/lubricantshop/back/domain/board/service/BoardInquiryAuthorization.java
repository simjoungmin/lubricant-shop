package com.lubricantshop.back.domain.board.service;

import com.lubricantshop.back.domain.board.Board;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.member.service.AdminAuthorizationService;
import com.lubricantshop.back.global.exception.ForbiddenException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import org.springframework.stereotype.Component;

@Component
public class BoardInquiryAuthorization {

    private static final String ADMIN_INQUIRIES_FORBIDDEN_MESSAGE = "관리자만 문의를 확인할 수 있습니다.";

    private final MemberRepository memberRepository;
    private final AdminAuthorizationService adminAuthorizationService;

    public BoardInquiryAuthorization(
            MemberRepository memberRepository,
            AdminAuthorizationService adminAuthorizationService
    ) {
        this.memberRepository = memberRepository;
        this.adminAuthorizationService = adminAuthorizationService;
    }

    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    }

    public Member requireAdmin(Long memberId) {
        return adminAuthorizationService.requireAdmin(memberId, ADMIN_INQUIRIES_FORBIDDEN_MESSAGE);
    }

    public void requireOwner(Long writerId, Board board) {
        if (!board.getWriter().getMemberId().equals(writerId)) {
            throw new ForbiddenException("본인이 작성한 문의만 확인할 수 있습니다.");
        }
    }
}

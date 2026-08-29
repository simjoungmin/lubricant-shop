package com.lubricantshop.back.domain.board.service;

import com.lubricantshop.back.domain.board.Board;
import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.ForbiddenException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import org.springframework.stereotype.Component;

@Component
public class BoardInquiryAuthorization {

    private final MemberRepository memberRepository;

    public BoardInquiryAuthorization(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    }

    public Member requireAdmin(Long memberId) {
        Member admin = findMember(memberId);
        if (admin.getRole() != MemberRole.ADMIN) {
            throw new ForbiddenException("관리자만 문의를 확인할 수 있습니다.");
        }

        return admin;
    }

    public void requireOwner(Long writerId, Board board) {
        if (!board.getWriter().getMemberId().equals(writerId)) {
            throw new ForbiddenException("본인이 작성한 문의만 확인할 수 있습니다.");
        }
    }
}

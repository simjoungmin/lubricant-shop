package com.lubricantshop.back.global.security;

import com.lubricantshop.back.domain.member.MemberRole;

public record AuthenticatedMember(
        Long memberId,
        MemberRole role
) {

    public boolean isAdmin() {
        return role == MemberRole.ADMIN;
    }
}

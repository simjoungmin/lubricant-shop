package com.lubricantshop.back.domain.member.dto.auth;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.SocialProvider;

public record MemberLoginResponse(
        Long memberId,
        String email,
        String loginId,
        String name,
        SocialProvider provider,
        MemberRole role,
        Integer pointBalance,
        String phoneNumber,
        String address
) {
}

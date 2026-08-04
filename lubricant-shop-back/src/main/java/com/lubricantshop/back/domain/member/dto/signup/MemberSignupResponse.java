package com.lubricantshop.back.domain.member.dto.signup;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.SocialProvider;

public record MemberSignupResponse(
        Long memberId,
        String email,
        String name,
        SocialProvider provider,
        MemberRole role,
        Integer pointBalance
) {
}

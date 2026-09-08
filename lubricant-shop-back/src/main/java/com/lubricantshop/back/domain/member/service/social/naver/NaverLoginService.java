package com.lubricantshop.back.domain.member.service.social.naver;

import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.dto.social.NaverMemberProfile;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NaverLoginService {

    private static final String AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";

    private final NaverOAuthProperties properties;
    private final NaverOAuthClient naverOAuthClient;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public NaverLoginService(
            NaverOAuthProperties properties,
            NaverOAuthClient naverOAuthClient,
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.properties = properties;
        this.naverOAuthClient = naverOAuthClient;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String buildAuthorizeUrl(String state) {
        properties.validateConfigured();
        return AUTHORIZE_URL
                + "?response_type=code"
                + "&client_id=" + encode(properties.clientId())
                + "&redirect_uri=" + encode(properties.redirectUri())
                + "&state=" + encode(state);
    }

    @Transactional
    public MemberLoginResponse login(String code, String state) {
        properties.validateConfigured();
        NaverMemberProfile profile = naverOAuthClient.fetchProfile(code, state);
        Member member = memberRepository.findByProviderAndProviderId(SocialProvider.NAVER, profile.providerId())
                .or(() -> findByEmail(profile.email()))
                .orElseGet(() -> createNaverMember(profile));

        return new MemberLoginResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getMemberName(),
                member.getProvider(),
                member.getRole(),
                member.getPointBalance()
        );
    }

    public String frontendRedirectUri() {
        return properties.frontendRedirectUri();
    }

    private Optional<Member> findByEmail(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }

        return memberRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
    }

    private Member createNaverMember(NaverMemberProfile profile) {
        String email = profile.email() == null || profile.email().isBlank()
                ? "naver_" + profile.providerId() + "@naver.local"
                : profile.email().trim().toLowerCase();
        String name = resolveName(profile);
        String password = passwordEncoder.encode("NAVER:" + profile.providerId());

        Member member = Member.createSocialMember(SocialProvider.NAVER, profile.providerId(), email, password, name);
        return memberRepository.save(member);
    }

    private String resolveName(NaverMemberProfile profile) {
        if (profile.name() != null && !profile.name().isBlank()) {
            return profile.name().trim();
        }

        if (profile.nickname() != null && !profile.nickname().isBlank()) {
            return profile.nickname().trim();
        }

        return "네이버 회원";
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}

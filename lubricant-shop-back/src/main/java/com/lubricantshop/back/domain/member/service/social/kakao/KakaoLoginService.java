package com.lubricantshop.back.domain.member.service.social.kakao;

import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.dto.social.KakaoMemberProfile;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class KakaoLoginService {

    private static final String AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";

    private final KakaoOAuthProperties properties;
    private final KakaoOAuthClient kakaoOAuthClient;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public KakaoLoginService(
            KakaoOAuthProperties properties,
            KakaoOAuthClient kakaoOAuthClient,
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.properties = properties;
        this.kakaoOAuthClient = kakaoOAuthClient;
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
    public MemberLoginResponse login(String code) {
        properties.validateConfigured();
        KakaoMemberProfile profile = kakaoOAuthClient.fetchProfile(code);
        Member member = memberRepository.findByProviderAndProviderId(SocialProvider.KAKAO, profile.providerId())
                .or(() -> findByEmail(profile.email()))
                .orElseGet(() -> createKakaoMember(profile));

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

    private java.util.Optional<Member> findByEmail(String email) {
        if (email == null || email.isBlank()) {
            return java.util.Optional.empty();
        }

        return memberRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
    }

    private Member createKakaoMember(KakaoMemberProfile profile) {
        String email = profile.email() == null || profile.email().isBlank()
                ? "kakao_" + profile.providerId() + "@kakao.local"
                : profile.email().trim().toLowerCase();
        String name = profile.nickname() == null || profile.nickname().isBlank() ? "카카오 회원" : profile.nickname().trim();
        String password = passwordEncoder.encode("KAKAO:" + profile.providerId());

        Member member = Member.createSocialMember(SocialProvider.KAKAO, profile.providerId(), email, password, name);
        return memberRepository.save(member);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}

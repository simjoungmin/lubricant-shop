package com.lubricantshop.back.domain.member.service.social.kakao;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.dto.social.KakaoMemberProfile;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class KakaoLoginService {

    private static final String AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";

    private final KakaoOAuthProperties properties;
    private final KakaoOAuthClient kakaoOAuthClient;
    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public KakaoLoginService(
            KakaoOAuthProperties properties,
            KakaoOAuthClient kakaoOAuthClient,
            MemberRepository memberRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.properties = properties;
        this.kakaoOAuthClient = kakaoOAuthClient;
        this.memberRepository = memberRepository;
        this.cartRepository = cartRepository;
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
        restoreOrRejectWithdrawnMember(member);

        return new MemberLoginResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getLoginId(),
                member.getMemberName(),
                member.getProvider(),
                member.getRole(),
                member.getPointBalance(),
                member.getPhoneNumber(),
                member.getAddress()
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

    private void restoreOrRejectWithdrawnMember(Member member) {
        LocalDateTime now = LocalDateTime.now();

        if (member.isWithdrawalExpired(now)) {
            cartRepository.deleteByMember_MemberId(member.getMemberId());
            member.finalizeWithdrawal(now);
            throw new UnauthorizedException("탈퇴 처리 완료된 계정입니다.");
        }

        if (member.canRestoreWithdrawal(now)) {
            member.restoreWithdrawal();
        }
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

package com.lubricantshop.back.domain.member.service.auth;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.dto.auth.MemberAddressUpdateRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginResponse;
import com.lubricantshop.back.domain.member.dto.auth.MemberNameUpdateRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberPasswordUpdateRequest;
import com.lubricantshop.back.domain.member.SocialProvider;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberAuthService {

    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberAuthService(
            MemberRepository memberRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.memberRepository = memberRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public MemberLoginResponse login(MemberLoginRequest request) {
        String loginId = request.loginId().trim().toLowerCase();
        Member member = memberRepository.findByLoginIdIgnoreCase(loginId)
                .orElseThrow(() -> new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다."));
        LocalDateTime now = LocalDateTime.now();

        if (member.isWithdrawalExpired(now)) {
            cartRepository.deleteByMember_MemberId(member.getMemberId());
            member.finalizeWithdrawal(now);
            throw new UnauthorizedException("탈퇴 처리 완료된 계정입니다.");
        }

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (member.canRestoreWithdrawal(now)) {
            member.restoreWithdrawal();
        }

        return toLoginResponse(member);
    }

    @Transactional(readOnly = true)
    public MemberLoginResponse findLoggedInMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        return toLoginResponse(member);
    }

    @Transactional
    public MemberLoginResponse updateName(Long memberId, MemberNameUpdateRequest request) {
        Member member = findMember(memberId);

        member.changeName(request.name().trim());

        return toLoginResponse(member);
    }

    @Transactional
    public MemberLoginResponse updateAddress(Long memberId, MemberAddressUpdateRequest request) {
        Member member = findMember(memberId);

        member.changeAddress(request.address().trim());

        return toLoginResponse(member);
    }

    @Transactional
    public void updatePassword(Long memberId, MemberPasswordUpdateRequest request) {
        Member member = findMember(memberId);

        if (member.getProvider() != SocialProvider.EMAIL) {
            throw new IllegalStateException("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
        }

        if (!passwordEncoder.matches(request.currentPassword(), member.getPassword())) {
            throw new UnauthorizedException("현재 비밀번호가 올바르지 않습니다.");
        }

        if (!request.newPassword().equals(request.newPasswordConfirm())) {
            throw new IllegalStateException("새 비밀번호가 일치하지 않습니다.");
        }

        if (passwordEncoder.matches(request.newPassword(), member.getPassword())) {
            throw new IllegalStateException("현재 비밀번호와 다른 비밀번호를 입력해 주세요.");
        }

        member.changePassword(passwordEncoder.encode(request.newPassword()));
    }

    @Transactional
    public void withdraw(Long memberId) {
        Member member = findMember(memberId);

        member.requestWithdrawal(LocalDateTime.now());
    }

    private Member findMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));

        if (member.isWithdrawn()) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        return member;
    }

    private MemberLoginResponse toLoginResponse(Member member) {
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
}

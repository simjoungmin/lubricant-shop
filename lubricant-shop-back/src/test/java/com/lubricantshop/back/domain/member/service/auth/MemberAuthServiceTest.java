package com.lubricantshop.back.domain.member.service.auth;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.dto.auth.MemberAddressUpdateRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberLoginRequest;
import com.lubricantshop.back.domain.member.dto.auth.MemberPasswordUpdateRequest;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class MemberAuthServiceTest {

    private static final String EMAIL = "user@example.com";
    private static final String LOGIN_ID = "testuser";
    private static final String CURRENT_PASSWORD = "OldPassword!1";
    private static final String NEW_PASSWORD = "NewPassword!1";

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private CartRepository cartRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private MemberAuthService memberAuthService;

    @BeforeEach
    void setUp() {
        memberAuthService = new MemberAuthService(memberRepository, cartRepository, passwordEncoder);
    }

    @Test
    void updatePasswordChangesPasswordWhenCurrentPasswordMatches() {
        Member member = createMember();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        memberAuthService.updatePassword(1L, new MemberPasswordUpdateRequest(
                CURRENT_PASSWORD,
                NEW_PASSWORD,
                NEW_PASSWORD
        ));

        assertTrue(passwordEncoder.matches(NEW_PASSWORD, member.getPassword()));
        assertFalse(passwordEncoder.matches(CURRENT_PASSWORD, member.getPassword()));
    }

    @Test
    void updatePasswordRejectsInvalidCurrentPassword() {
        Member member = createMember();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        assertThrows(UnauthorizedException.class, () -> memberAuthService.updatePassword(
                1L,
                new MemberPasswordUpdateRequest("WrongPassword!1", NEW_PASSWORD, NEW_PASSWORD)
        ));
    }

    @Test
    void updateAddressChangesDefaultShippingAddress() {
        Member member = createMember();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        memberAuthService.updateAddress(1L, new MemberAddressUpdateRequest("12345 서울시 강남구 테스트로 1"));

        assertEquals("12345 서울시 강남구 테스트로 1", member.getAddress());
    }

    @Test
    void withdrawMarksMemberAsWithdrawn() {
        Member member = createMember();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        memberAuthService.withdraw(1L);

        assertTrue(member.isWithdrawn());
    }

    @Test
    void loginRestoresWithdrawalWhenGracePeriodRemains() {
        Member member = createMember();
        member.requestWithdrawal(LocalDateTime.now().minusDays(3));
        when(memberRepository.findByLoginIdIgnoreCase(LOGIN_ID)).thenReturn(Optional.of(member));

        memberAuthService.login(new MemberLoginRequest(LOGIN_ID, CURRENT_PASSWORD));

        assertFalse(member.isWithdrawn());
    }

    @Test
    void loginFinalizesExpiredWithdrawalAndDeletesCart() {
        Member member = createMember();
        member.requestWithdrawal(LocalDateTime.now().minusDays(8));
        when(memberRepository.findByLoginIdIgnoreCase(LOGIN_ID)).thenReturn(Optional.of(member));

        assertThrows(UnauthorizedException.class, () ->
                memberAuthService.login(new MemberLoginRequest(LOGIN_ID, CURRENT_PASSWORD))
        );

        assertTrue(member.isWithdrawn());
        verify(cartRepository).deleteByMember_MemberId(member.getMemberId());
    }

    private Member createMember() {
        return new Member(
                EMAIL,
                LOGIN_ID,
                passwordEncoder.encode(CURRENT_PASSWORD),
                "홍길동",
                "01012345678",
                "",
                true,
                true,
                false,
                ""
        );
    }
}

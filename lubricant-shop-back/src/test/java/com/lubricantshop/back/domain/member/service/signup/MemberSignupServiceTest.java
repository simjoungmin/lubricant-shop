package com.lubricantshop.back.domain.member.service.signup;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lubricantshop.back.domain.member.dto.signup.MemberSignupRequest;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.member.service.verification.SignupPhoneVerificationService;
import com.lubricantshop.back.global.exception.ConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class MemberSignupServiceTest {

    private static final String PHONE = "010-1234-5678";
    private static final String NORMALIZED_PHONE = "01012345678";
    private static final String VERIFICATION_TOKEN = "verified-token";

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private SignupPhoneVerificationService signupPhoneVerificationService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private MemberSignupService memberSignupService;

    @BeforeEach
    void setUp() {
        memberSignupService = new MemberSignupService(
                memberRepository,
                passwordEncoder,
                signupPhoneVerificationService
        );
    }

    @Test
    void signupStoresVerifiedPhoneNumber() {
        MemberSignupRequest request = createRequest();
        when(memberRepository.save(any(Member.class))).thenAnswer(invocation -> invocation.getArgument(0));

        memberSignupService.signup(request);

        ArgumentCaptor<Member> memberCaptor = ArgumentCaptor.forClass(Member.class);
        verify(signupPhoneVerificationService).verifyAndConsume(NORMALIZED_PHONE, VERIFICATION_TOKEN);
        verify(memberRepository).save(memberCaptor.capture());
        assertEquals(NORMALIZED_PHONE, memberCaptor.getValue().getPhoneNumber());
    }

    @Test
    void signupRejectsDuplicatedPhoneNumber() {
        MemberSignupRequest request = createRequest();
        when(memberRepository.existsByPhoneNumber(NORMALIZED_PHONE)).thenReturn(true);

        assertThrows(ConflictException.class, () -> memberSignupService.signup(request));

        verify(signupPhoneVerificationService, never()).verifyAndConsume(any(), any());
        verify(memberRepository, never()).save(any());
    }

    private MemberSignupRequest createRequest() {
        return new MemberSignupRequest(
                "user@example.com",
                "testuser",
                "Password!1",
                "테스트회원",
                "서울시 강남구",
                PHONE,
                VERIFICATION_TOKEN,
                true,
                true,
                false,
                ""
        );
    }
}

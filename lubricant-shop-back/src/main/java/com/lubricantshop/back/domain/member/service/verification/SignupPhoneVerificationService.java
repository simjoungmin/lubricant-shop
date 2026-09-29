package com.lubricantshop.back.domain.member.service.verification;

import com.lubricantshop.back.domain.member.dto.signup.PhoneVerificationConfirmResponse;
import com.lubricantshop.back.global.exception.BadRequestException;
import com.lubricantshop.back.global.sms.SmsClient;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class SignupPhoneVerificationService {

    private static final int CODE_BOUND = 1_000_000;
    private static final int TOKEN_BYTE_LENGTH = 32;
    private static final int CODE_TTL_MINUTES = 5;
    private static final int TOKEN_TTL_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, VerificationCode> verificationCodes = new ConcurrentHashMap<>();
    private final Map<String, VerificationToken> verificationTokens = new ConcurrentHashMap<>();
    private final SmsClient smsClient;

    public SignupPhoneVerificationService(SmsClient smsClient) {
        this.smsClient = smsClient;
    }

    public void sendCode(String phone) {
        String normalizedPhone = normalizePhone(phone);
        String code = String.format("%06d", secureRandom.nextInt(CODE_BOUND));
        verificationCodes.put(normalizedPhone, new VerificationCode(code, LocalDateTime.now().plusMinutes(CODE_TTL_MINUTES), 0));
        verificationTokens.remove(normalizedPhone);

        try {
            smsClient.sendSignupVerificationCode(normalizedPhone, code);
        } catch (RuntimeException exception) {
            verificationCodes.remove(normalizedPhone);
            throw exception;
        }
    }

    public PhoneVerificationConfirmResponse confirmCode(String phone, String code) {
        String normalizedPhone = normalizePhone(phone);
        VerificationCode verificationCode = verificationCodes.get(normalizedPhone);

        if (verificationCode == null || verificationCode.expiresAt().isBefore(LocalDateTime.now())) {
            verificationCodes.remove(normalizedPhone);
            throw new BadRequestException("인증번호가 만료되었습니다. 다시 발송해 주세요.");
        }

        if (verificationCode.attempts() >= MAX_ATTEMPTS) {
            verificationCodes.remove(normalizedPhone);
            throw new BadRequestException("인증번호 확인 횟수를 초과했습니다. 다시 발송해 주세요.");
        }

        if (!verificationCode.code().equals(code.trim())) {
            verificationCodes.put(normalizedPhone, verificationCode.increaseAttempts());
            throw new BadRequestException("인증번호가 올바르지 않습니다.");
        }

        verificationCodes.remove(normalizedPhone);
        String token = createToken();
        verificationTokens.put(normalizedPhone, new VerificationToken(token, LocalDateTime.now().plusMinutes(TOKEN_TTL_MINUTES)));

        return new PhoneVerificationConfirmResponse("휴대폰 인증이 완료되었습니다.", token);
    }

    public void verifyAndConsume(String phone, String token) {
        String normalizedPhone = normalizePhone(phone);
        VerificationToken verificationToken = verificationTokens.get(normalizedPhone);

        if (verificationToken == null || verificationToken.expiresAt().isBefore(LocalDateTime.now())) {
            verificationTokens.remove(normalizedPhone);
            throw new BadRequestException("휴대폰 인증이 만료되었습니다. 다시 인증해 주세요.");
        }

        if (!verificationToken.token().equals(token.trim())) {
            throw new BadRequestException("휴대폰 인증 정보를 확인해 주세요.");
        }

        verificationTokens.remove(normalizedPhone);
    }

    private String createToken() {
        byte[] randomBytes = new byte[TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String normalizePhone(String phone) {
        return phone.trim().replaceAll("[^0-9]", "");
    }

    private record VerificationCode(String code, LocalDateTime expiresAt, int attempts) {

        VerificationCode increaseAttempts() {
            return new VerificationCode(code, expiresAt, attempts + 1);
        }
    }

    private record VerificationToken(String token, LocalDateTime expiresAt) {
    }
}

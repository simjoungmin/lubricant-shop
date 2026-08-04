package com.lubricantshop.back.domain.member.service.verification;

import com.lubricantshop.back.domain.member.dto.recovery.PasswordVerificationMethod;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class PasswordVerificationService {

    private static final int CODE_BOUND = 1_000_000;
    private static final int CODE_TTL_MINUTES = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, VerificationCode> verificationCodes = new ConcurrentHashMap<>();

    public String createCode(String email, PasswordVerificationMethod method, String receiver) {
        String code = String.format("%06d", secureRandom.nextInt(CODE_BOUND));
        String normalizedEmail = normalizeEmail(email);
        verificationCodes.put(normalizedEmail, new VerificationCode(code, LocalDateTime.now().plusMinutes(CODE_TTL_MINUTES)));

        return code;
    }

    public boolean verifyAndConsume(String email, String code) {
        String normalizedEmail = normalizeEmail(email);
        VerificationCode verificationCode = verificationCodes.get(normalizedEmail);

        if (verificationCode == null || verificationCode.expiresAt().isBefore(LocalDateTime.now())) {
            verificationCodes.remove(normalizedEmail);
            return false;
        }

        boolean matches = verificationCode.code().equals(code);
        if (matches) {
            verificationCodes.remove(normalizedEmail);
        }

        return matches;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private record VerificationCode(String code, LocalDateTime expiresAt) {
    }
}

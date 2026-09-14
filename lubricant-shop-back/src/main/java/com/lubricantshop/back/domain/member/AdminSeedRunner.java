package com.lubricantshop.back.domain.member;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminSeedRunner implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedEnabled;
    private final String loginId;
    private final String email;
    private final String password;
    private final String memberName;
    private final String phoneNumber;

    public AdminSeedRunner(
            MemberRepository memberRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.seed.enabled:false}") boolean seedEnabled,
            @Value("${app.admin.seed.login-id:admin}") String loginId,
            @Value("${app.admin.seed.email:admin@oil-master.local}") String email,
            @Value("${app.admin.seed.password:}") String password,
            @Value("${app.admin.seed.name:관리자}") String memberName,
            @Value("${app.admin.seed.phone:01000000000}") String phoneNumber
    ) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedEnabled = seedEnabled;
        this.loginId = loginId;
        this.email = email;
        this.password = password;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }

        if (password == null || password.isBlank()) {
            throw new IllegalStateException("관리자 시드 비밀번호를 설정해 주세요.");
        }

        String normalizedLoginId = loginId.trim().toLowerCase();
        String normalizedEmail = email.trim().toLowerCase();
        String encodedPassword = passwordEncoder.encode(password);

        memberRepository.findByLoginIdIgnoreCase(normalizedLoginId)
                .ifPresentOrElse(
                        member -> refreshAdmin(member, encodedPassword),
                        () -> createAdmin(normalizedLoginId, normalizedEmail, encodedPassword)
                );
    }

    private void refreshAdmin(Member member, String encodedPassword) {
        member.refreshSeedProfile(
                encodedPassword,
                memberName.trim(),
                normalizePhone(phoneNumber),
                "",
                "",
                true,
                true,
                false
        );
        member.promoteToAdmin();
    }

    private void createAdmin(String normalizedLoginId, String normalizedEmail, String encodedPassword) {
        if (memberRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalStateException("관리자 시드 이메일이 이미 다른 계정에서 사용 중입니다.");
        }

        Member admin = new Member(
                normalizedEmail,
                normalizedLoginId,
                encodedPassword,
                memberName.trim(),
                normalizePhone(phoneNumber),
                "",
                true,
                true,
                false,
                ""
        );
        admin.promoteToAdmin();
        memberRepository.save(admin);
    }

    private String normalizePhone(String value) {
        return value.trim().replace("-", "");
    }
}

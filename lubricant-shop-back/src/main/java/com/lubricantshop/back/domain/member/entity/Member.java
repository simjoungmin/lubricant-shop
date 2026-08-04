package com.lubricantshop.back.domain.member.entity;

import com.lubricantshop.back.domain.member.MemberRole;
import com.lubricantshop.back.domain.member.SocialProvider;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// 쇼핑몰 회원의 로그인 정보, 연락처, 권한, 포인트 잔액을 저장하는 엔티티입니다.
@Entity
@Table(name = "member")
public class Member {

    // 회원 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    // 로그인 ID로 사용하는 이메일입니다.
    @Column(name = "email", nullable = false, unique = true, length = 160)
    private String email;

    // 암호화되어 저장되는 비밀번호입니다.
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    // 회원 이름입니다.
    @Column(name = "member_name", nullable = false, length = 80)
    private String memberName;

    // 주문/회원 찾기에 사용하는 휴대폰 번호입니다.
    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    // 이메일 가입, 카카오 가입 등 가입 제공자입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "provider", length = 20)
    private SocialProvider provider = SocialProvider.EMAIL;

    // 소셜 로그인 제공자가 내려주는 회원 식별값입니다.
    @Column(name = "provider_id", length = 120)
    private String providerId;

    // 기본 배송지 또는 회원 주소입니다.
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // 이용약관 필수 동의 여부입니다.
    @Column(name = "terms_agreed", nullable = false)
    private Boolean termsAgreed = false;

    // 개인정보 수집 및 이용 필수 동의 여부입니다.
    @Column(name = "privacy_agreed", nullable = false)
    private Boolean privacyAgreed = false;

    // 마케팅 수신 선택 동의 여부입니다.
    @Column(name = "marketing_agreed", nullable = false)
    private Boolean marketingAgreed = false;

    // 회원이 입력한 차량 정보입니다.
    @Column(name = "vehicle_info", length = 255)
    private String vehicleInfo;

    // 일반 회원 또는 관리자 권한입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private MemberRole role = MemberRole.USER;

    // 회원 가입 시각입니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 회원 정보 마지막 수정 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 탈퇴 처리 시각입니다.
    @Column(name = "withdrawn_at")
    private LocalDateTime withdrawnAt;

    // 탈퇴 여부입니다. 실제 삭제 대신 계정 비활성화에 사용합니다.
    @Column(name = "is_withdrawn", nullable = false)
    private Boolean withdrawn = false;

    // 결제 시 사용할 수 있는 현재 보유 포인트입니다.
    @Column(name = "point_balance", nullable = false, columnDefinition = "integer default 0")
    private Integer pointBalance = 0;

    protected Member() {
    }

    public Member(
            String email,
            String password,
            String memberName,
            String phoneNumber,
            String address,
            Boolean termsAgreed,
            Boolean privacyAgreed,
            Boolean marketingAgreed,
            String vehicleInfo
    ) {
        this.email = email;
        this.password = password;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.termsAgreed = termsAgreed;
        this.privacyAgreed = privacyAgreed;
        this.marketingAgreed = marketingAgreed;
        this.vehicleInfo = vehicleInfo;
    }

    // 소셜 로그인으로 처음 가입한 회원을 생성합니다.
    public static Member createSocialMember(
            SocialProvider provider,
            String providerId,
            String email,
            String password,
            String memberName
    ) {
        Member member = new Member(
                email,
                password,
                memberName,
                "",
                "",
                true,
                true,
                false,
                ""
        );
        member.provider = provider;
        member.providerId = providerId;
        return member;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getMemberName() {
        return memberName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public SocialProvider getProvider() {
        return provider;
    }

    public MemberRole getRole() {
        return role;
    }

    public String getProviderId() {
        return providerId;
    }

    public Integer getPointBalance() {
        return pointBalance == null ? 0 : pointBalance;
    }

    // 개발/초기 데이터용 관리자 계정 생성 시 권한을 관리자까지 올립니다.
    public void promoteToAdmin() {
        role = MemberRole.ADMIN;
    }

    // 초기 데이터가 깨졌거나 바뀐 경우 seed 회원 정보를 최신 값으로 맞춥니다.
    public void refreshSeedProfile(
            String password,
            String memberName,
            String phoneNumber,
            String address,
            String vehicleInfo,
            Boolean termsAgreed,
            Boolean privacyAgreed,
            Boolean marketingAgreed
    ) {
        this.password = password;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.vehicleInfo = vehicleInfo;
        this.termsAgreed = termsAgreed;
        this.privacyAgreed = privacyAgreed;
        this.marketingAgreed = marketingAgreed;
    }

    // 결제 시 사용한 포인트만큼 보유 포인트를 차감합니다.
    public void usePoints(int points) {
        if (points < 0) {
            throw new IllegalArgumentException("사용 포인트는 0보다 작을 수 없습니다.");
        }

        if (getPointBalance() < points) {
            throw new IllegalArgumentException("보유 포인트가 부족합니다.");
        }

        pointBalance = getPointBalance() - points;
    }

    // 구매 확정 또는 주문 생성 시 적립 포인트를 더합니다.
    public void earnPoints(int points) {
        if (points < 0) {
            throw new IllegalArgumentException("적립 포인트는 0보다 작을 수 없습니다.");
        }

        pointBalance = getPointBalance() + points;
    }

    // 비밀번호 찾기/재설정 시 암호화된 새 비밀번호로 교체합니다.
    public void changePassword(String password) {
        this.password = password;
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (pointBalance == null) {
            pointBalance = 0;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

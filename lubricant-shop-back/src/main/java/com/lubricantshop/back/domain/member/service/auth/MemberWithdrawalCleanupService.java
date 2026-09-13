package com.lubricantshop.back.domain.member.service.auth;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberWithdrawalCleanupService {

    private static final int WITHDRAWAL_GRACE_PERIOD_DAYS = 7;

    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;

    public MemberWithdrawalCleanupService(
            MemberRepository memberRepository,
            CartRepository cartRepository
    ) {
        this.memberRepository = memberRepository;
        this.cartRepository = cartRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void finalizeExpiredWithdrawals() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cutoff = now.minusDays(WITHDRAWAL_GRACE_PERIOD_DAYS);
        List<Member> expiredMembers =
                memberRepository.findByWithdrawnTrueAndWithdrawalFinalizedAtIsNullAndWithdrawnAtLessThanEqual(cutoff);

        for (Member member : expiredMembers) {
            cartRepository.deleteByMember_MemberId(member.getMemberId());
            member.finalizeWithdrawal(now);
        }
    }
}

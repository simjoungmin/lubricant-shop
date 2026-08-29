package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.order.dto.OrderCreateRequest;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class OrderPointCalculator {

    public int resolvePointUsed(Member member, OrderCreateRequest request, BigDecimal totalOrderAmount) {
        if (!request.usePoints()) {
            return 0;
        }

        int pointAmount = request.pointAmount() == null ? 0 : request.pointAmount();
        if (pointAmount > member.getPointBalance()) {
            throw new IllegalArgumentException("사용 포인트가 보유 포인트보다 큽니다.");
        }

        if (BigDecimal.valueOf(pointAmount).compareTo(totalOrderAmount) > 0) {
            throw new IllegalArgumentException("사용 포인트가 주문 금액보다 큽니다.");
        }

        return pointAmount;
    }
}

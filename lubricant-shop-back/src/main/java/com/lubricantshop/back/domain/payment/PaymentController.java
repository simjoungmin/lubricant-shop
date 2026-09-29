package com.lubricantshop.back.domain.payment;

import com.lubricantshop.back.domain.payment.dto.PaymentConfirmRequest;
import com.lubricantshop.back.domain.payment.dto.PaymentConfirmResponse;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/confirm")
    public PaymentConfirmResponse confirmPayment(
            @AuthenticationPrincipal AuthenticatedMember member,
            @Valid @RequestBody PaymentConfirmRequest request
    ) {
        return paymentService.confirmTossPayment(member.memberId(), request);
    }
}

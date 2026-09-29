package com.lubricantshop.back.domain.payment;

import com.lubricantshop.back.domain.order.Order;
import com.lubricantshop.back.domain.order.OrderPaymentCompletionService;
import com.lubricantshop.back.domain.order.OrderRepository;
import com.lubricantshop.back.domain.order.OrderStatus;
import com.lubricantshop.back.domain.payment.dto.PaymentConfirmRequest;
import com.lubricantshop.back.domain.payment.dto.PaymentConfirmResponse;
import com.lubricantshop.back.domain.payment.toss.TossPaymentConfirmRequest;
import com.lubricantshop.back.domain.payment.toss.TossPaymentConfirmResponse;
import com.lubricantshop.back.domain.payment.toss.TossPaymentsClient;
import com.lubricantshop.back.global.exception.BadRequestException;
import com.lubricantshop.back.global.exception.ConflictException;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final TossPaymentsClient tossPaymentsClient;
    private final OrderPaymentCompletionService orderPaymentCompletionService;

    public PaymentService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            TossPaymentsClient tossPaymentsClient,
            OrderPaymentCompletionService orderPaymentCompletionService
    ) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.tossPaymentsClient = tossPaymentsClient;
        this.orderPaymentCompletionService = orderPaymentCompletionService;
    }

    @Transactional
    public PaymentConfirmResponse confirmTossPayment(Long memberId, PaymentConfirmRequest request) {
        Order order = orderRepository.findByPgOrderIdAndMemberIdForUpdate(request.orderId(), memberId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 주문입니다."));

        Payment existingPayment = paymentRepository.findByOrder_OrderId(order.getOrderId()).orElse(null);
        if (existingPayment != null) {
            if (!existingPayment.getPaymentKey().equals(request.paymentKey())) {
                throw new ConflictException("이미 다른 결제 정보로 승인된 주문입니다.");
            }

            return PaymentConfirmResponse.from(order, existingPayment);
        }

        validateConfirmRequest(order, request);
        orderPaymentCompletionService.validateReadyToComplete(order);

        TossPaymentConfirmResponse tossResponse = tossPaymentsClient.confirm(new TossPaymentConfirmRequest(
                request.paymentKey(),
                request.orderId(),
                request.amount()
        ));
        validateTossResponse(request, tossResponse);

        Payment payment = paymentRepository.save(new Payment(
                order,
                PaymentProvider.TOSS_PAYMENTS,
                tossResponse.paymentKey(),
                tossResponse.orderId(),
                BigDecimal.valueOf(tossResponse.totalAmount()),
                tossResponse.method(),
                tossResponse.status(),
                tossResponse.approvedAt(),
                tossResponse.rawResponse()
        ));

        orderPaymentCompletionService.completePayment(order);

        return PaymentConfirmResponse.from(order, payment);
    }

    private void validateConfirmRequest(Order order, PaymentConfirmRequest request) {
        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new ConflictException("결제 대기 상태의 주문만 승인할 수 있습니다.");
        }

        BigDecimal requestedAmount = BigDecimal.valueOf(request.amount());
        if (order.getPaymentAmount().compareTo(requestedAmount) != 0) {
            throw new BadRequestException("결제 금액이 주문 금액과 일치하지 않습니다.");
        }

        if (!request.orderId().equals(order.getPgOrderId())) {
            throw new BadRequestException("PG 주문번호가 주문 정보와 일치하지 않습니다.");
        }
    }

    private void validateTossResponse(
            PaymentConfirmRequest request,
            TossPaymentConfirmResponse response
    ) {
        if (!request.paymentKey().equals(response.paymentKey())) {
            throw new BadRequestException("결제 키가 승인 응답과 일치하지 않습니다.");
        }

        if (!request.orderId().equals(response.orderId())) {
            throw new BadRequestException("PG 주문번호가 승인 응답과 일치하지 않습니다.");
        }

        if (!request.amount().equals(response.totalAmount())) {
            throw new BadRequestException("승인 금액이 주문 금액과 일치하지 않습니다.");
        }

        if (!"DONE".equals(response.status())) {
            throw new BadRequestException("완료되지 않은 결제입니다.");
        }
    }
}

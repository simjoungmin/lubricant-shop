package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.OrderCreateRequest;
import com.lubricantshop.back.domain.order.dto.OrderCreateResponse;
import com.lubricantshop.back.domain.order.dto.OrderPaymentCompleteResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderDetailResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderSummaryResponse;
import com.lubricantshop.back.global.security.JwtTokenProvider;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;

    public OrderController(OrderService orderService, JwtTokenProvider jwtTokenProvider) {
        this.orderService = orderService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping
    public OrderCreateResponse createOrder(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @Valid @RequestBody OrderCreateRequest request
    ) {
        Long memberId = jwtTokenProvider.getMemberId(accessToken);
        return orderService.createOrder(memberId, request);
    }

    @GetMapping("/my")
    public List<MyOrderSummaryResponse> findMyOrders(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        Long memberId = jwtTokenProvider.getMemberId(accessToken);
        return orderService.findMyOrders(memberId);
    }

    @GetMapping("/my/{orderId}")
    public MyOrderDetailResponse findMyOrder(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long orderId
    ) {
        Long memberId = jwtTokenProvider.getMemberId(accessToken);
        return orderService.findMyOrder(memberId, orderId);
    }

    @PostMapping("/{orderId}/test-payment-complete")
    public OrderPaymentCompleteResponse completeTestPayment(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long orderId
    ) {
        Long memberId = jwtTokenProvider.getMemberId(accessToken);
        return orderService.completeTestPayment(memberId, orderId);
    }
}

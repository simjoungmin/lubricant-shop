package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.OrderCreateRequest;
import com.lubricantshop.back.domain.order.dto.OrderCreateResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderDetailResponse;
import com.lubricantshop.back.domain.order.dto.MyOrderSummaryResponse;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderCreateResponse createOrder(
            @AuthenticationPrincipal AuthenticatedMember member,
            @Valid @RequestBody OrderCreateRequest request
    ) {
        return orderService.createOrder(member.memberId(), request);
    }

    @GetMapping("/my")
    public List<MyOrderSummaryResponse> findMyOrders(
            @AuthenticationPrincipal AuthenticatedMember member
    ) {
        return orderService.findMyOrders(member.memberId());
    }

    @GetMapping("/my/{orderId}")
    public MyOrderDetailResponse findMyOrder(
            @AuthenticationPrincipal AuthenticatedMember member,
            @PathVariable Long orderId
    ) {
        return orderService.findMyOrder(member.memberId(), orderId);
    }

}

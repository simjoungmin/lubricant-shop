package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderShipmentUpdateRequest;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderAdminController {

    private final OrderAdminService orderAdminService;

    public OrderAdminController(OrderAdminService orderAdminService) {
        this.orderAdminService = orderAdminService;
    }

    @GetMapping
    public List<AdminOrderResponse> findOrders(
            @AuthenticationPrincipal AuthenticatedMember admin
    ) {
        return orderAdminService.findOrders(admin.memberId());
    }

    @GetMapping("/{orderId}")
    public AdminOrderResponse findOrder(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long orderId
    ) {
        return orderAdminService.findOrder(admin.memberId(), orderId);
    }

    @PatchMapping("/{orderId}/status")
    public AdminOrderResponse updateStatus(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long orderId,
            @Valid @RequestBody AdminOrderStatusUpdateRequest request
    ) {
        return orderAdminService.updateStatus(admin.memberId(), orderId, request);
    }

    @PatchMapping("/{orderId}/shipment")
    public AdminOrderResponse updateShipment(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long orderId,
            @Valid @RequestBody AdminOrderShipmentUpdateRequest request
    ) {
        return orderAdminService.updateShipment(admin.memberId(), orderId, request);
    }

    @PostMapping("/{orderId}/payment-complete")
    public AdminOrderResponse completePayment(
            @AuthenticationPrincipal AuthenticatedMember admin,
            @PathVariable Long orderId
    ) {
        return orderAdminService.completePayment(admin.memberId(), orderId);
    }
}

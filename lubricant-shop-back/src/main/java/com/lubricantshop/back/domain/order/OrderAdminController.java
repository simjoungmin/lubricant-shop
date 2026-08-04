package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public List<AdminOrderResponse> findOrders() {
        return orderAdminService.findOrders();
    }

    @PatchMapping("/{orderId}/status")
    public AdminOrderResponse updateStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody AdminOrderStatusUpdateRequest request
    ) {
        return orderAdminService.updateStatus(orderId, request);
    }
}

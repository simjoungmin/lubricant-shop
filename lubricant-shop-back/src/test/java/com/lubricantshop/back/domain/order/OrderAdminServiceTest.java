package com.lubricantshop.back.domain.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.service.AdminAuthorizationService;
import com.lubricantshop.back.domain.order.dto.AdminOrderResponse;
import com.lubricantshop.back.domain.order.dto.AdminOrderStatusUpdateRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class OrderAdminServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private AdminAuthorizationService adminAuthorizationService;

    @Mock
    private OrderPaymentCompletionService orderPaymentCompletionService;

    private OrderAdminService orderAdminService;

    @BeforeEach
    void setUp() {
        orderAdminService = new OrderAdminService(
                orderRepository,
                orderItemRepository,
                adminAuthorizationService,
                orderPaymentCompletionService
        );
    }

    @Test
    void shippingStatusUsesSavedShipmentWhenRequestOmitsShipmentFields() {
        Member admin = createMember("admin@example.com", "admin");
        Member customer = createMember("customer@example.com", "customer");
        ReflectionTestUtils.setField(admin, "memberId", 1L);
        ReflectionTestUtils.setField(customer, "memberId", 2L);
        Order order = createPaidPreparingOrder(customer);
        ReflectionTestUtils.setField(order, "orderId", 10L);
        order.updateShipment("CJ대한통운", "QA-1234", "출고 준비 완료");

        when(adminAuthorizationService.requireAdmin(eq(1L), anyString())).thenReturn(admin);
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(10L)).thenReturn(List.of());

        AdminOrderResponse response = orderAdminService.updateStatus(
                1L,
                10L,
                new AdminOrderStatusUpdateRequest(OrderStatus.SHIPPING, null, null, null)
        );

        assertEquals(OrderStatus.SHIPPING, response.orderStatus());
        assertEquals("CJ대한통운", response.courier());
        assertEquals("QA-1234", response.trackingNumber());
    }

    private Order createPaidPreparingOrder(Member member) {
        Order order = new Order(
                member,
                BigDecimal.valueOf(30000),
                "서울시 강남구 테헤란로 1",
                PaymentMethod.BANK_TRANSFER,
                BigDecimal.valueOf(30000),
                0,
                300,
                "홍길동",
                "01012345678",
                null
        );
        order.changeStatus(OrderStatus.PAID);
        order.changeStatus(OrderStatus.PREPARING);
        return order;
    }

    private Member createMember(String email, String loginId) {
        return new Member(
                email,
                loginId,
                "encoded-password",
                "홍길동",
                "01012345678",
                "서울시 강남구",
                true,
                true,
                false,
                ""
        );
    }
}

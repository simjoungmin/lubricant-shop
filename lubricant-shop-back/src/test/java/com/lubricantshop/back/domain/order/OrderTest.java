package com.lubricantshop.back.domain.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.lubricantshop.back.domain.member.entity.Member;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void shippingStatusRequiresCourierAndTrackingNumber() {
        Order order = createPaidPreparingOrder();

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> order.changeStatus(OrderStatus.SHIPPING)
        );

        assertEquals("배송중 처리하려면 택배사와 송장번호가 필요합니다.", exception.getMessage());
        assertEquals(OrderStatus.PREPARING, order.getOrderStatus());
    }

    @Test
    void shippingStatusStoresShipmentStartedAtWhenShipmentInfoExists() {
        Order order = createPaidPreparingOrder();

        order.updateShipment(" CJ대한통운 ", " 1234-5678 ", " 출고 완료 ");
        order.changeStatus(OrderStatus.SHIPPING);

        assertEquals(OrderStatus.SHIPPING, order.getOrderStatus());
        assertEquals("CJ대한통운", order.getCourier());
        assertEquals("1234-5678", order.getTrackingNumber());
        assertEquals("출고 완료", order.getShipmentMemo());
        assertNotNull(order.getShippedAt());
    }

    @Test
    void shippedOrderCannotClearRequiredShipmentInfo() {
        Order order = createPaidPreparingOrder();
        order.updateShipment("CJ대한통운", "1234-5678", null);
        order.changeStatus(OrderStatus.SHIPPING);

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> order.updateShipment("", "", "송장 제거 시도")
        );

        assertEquals("배송중 처리하려면 택배사와 송장번호가 필요합니다.", exception.getMessage());
        assertEquals("CJ대한통운", order.getCourier());
        assertEquals("1234-5678", order.getTrackingNumber());
    }

    private Order createPaidPreparingOrder() {
        Order order = new Order(
                createMember(),
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

    private Member createMember() {
        return new Member(
                "user@example.com",
                "user",
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

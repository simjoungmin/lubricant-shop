package com.lubricantshop.back.domain.order;

public enum OrderStatus {
    // 주문 접수
    ORDERED,

    // 결제 완료
    PAID,

    // 상품 준비중
    PREPARING,

    // 배송중
    SHIPPING,

    // 배송 완료
    DELIVERED,

    // 주문 취소
    CANCELED
}

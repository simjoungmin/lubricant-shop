package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// 한 번의 주문에 대한 회원, 금액, 배송지, 결제수단, 처리 상태를 저장하는 엔티티입니다.
@Entity
@Table(name = "orders")
public class Order {

    // 주문 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    // 주문한 회원입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 포인트 차감 전 상품 주문 총액입니다.
    @Column(name = "total_order_amount", nullable = false, precision = 12, scale = 0)
    private BigDecimal totalOrderAmount;

    // 현재 주문 처리 상태입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 30)
    private OrderStatus orderStatus = OrderStatus.ORDERED;

    // 배송받을 전체 주소입니다.
    @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
    private String shippingAddress;

    // 카드, 무통장입금 등 고객이 선택한 결제 방식입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    // 포인트 차감 후 실제 결제해야 하는 금액입니다.
    @Column(name = "payment_amount", nullable = false, precision = 12, scale = 0)
    private BigDecimal paymentAmount;

    @Column(name = "pg_order_id", unique = true, length = 64)
    private String pgOrderId;

    // 이번 주문에서 사용한 포인트입니다.
    @Column(name = "point_used", nullable = false)
    private Integer pointUsed = 0;

    // 이번 주문으로 적립 예정인 포인트입니다.
    @Column(name = "point_earned", nullable = false)
    private Integer pointEarned = 0;

    // 주문이 접수된 시각입니다.
    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    // 수령인 이름입니다.
    @Column(name = "receiver_name", nullable = false, length = 80)
    private String receiverName;

    // 수령인 연락처입니다.
    @Column(name = "receiver_phone", nullable = false, length = 30)
    private String receiverPhone;

    // 고객이 남긴 배송 요청사항입니다.
    @Column(name = "delivery_request", length = 500)
    private String deliveryRequest;

    // 배송을 담당하는 택배사 이름입니다.
    @Column(name = "courier", length = 80)
    private String courier;

    // 송장번호는 앞자리 0, 하이픈, 문자 포함 가능성이 있어 문자열로 저장합니다.
    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    // 관리자가 배송 처리 시 남기는 내부 출고 메모입니다.
    @Column(name = "shipment_memo", length = 500)
    private String shipmentMemo;

    // 배송중 상태로 변경된 시각입니다.
    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    // 배송완료 상태로 변경된 시각입니다.
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    // 주문 정보나 주문 상태가 마지막으로 변경된 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 주문 취소 시각입니다.
    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    protected Order() {
    }

    public Order(
            Member member,
            BigDecimal totalOrderAmount,
            String shippingAddress,
            PaymentMethod paymentMethod,
            BigDecimal paymentAmount,
            Integer pointUsed,
            Integer pointEarned,
            String receiverName,
            String receiverPhone,
            String deliveryRequest
    ) {
        this.member = member;
        this.totalOrderAmount = totalOrderAmount;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.paymentAmount = paymentAmount;
        this.pointUsed = pointUsed;
        this.pointEarned = pointEarned;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.deliveryRequest = deliveryRequest;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Member getMember() {
        return member;
    }

    public BigDecimal getTotalOrderAmount() {
        return totalOrderAmount;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public String getPgOrderId() {
        return pgOrderId;
    }

    public Integer getPointUsed() {
        return pointUsed;
    }

    public Integer getPointEarned() {
        return pointEarned;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getDeliveryRequest() {
        return deliveryRequest;
    }

    public String getCourier() {
        return courier;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getShipmentMemo() {
        return shipmentMemo;
    }

    public LocalDateTime getShippedAt() {
        return shippedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void assignPgOrderId(String pgOrderId) {
        if (pgOrderId == null || pgOrderId.isBlank()) {
            throw new IllegalArgumentException("PG 주문번호가 필요합니다.");
        }

        this.pgOrderId = pgOrderId;
    }

    public void updateShipment(String courier, String trackingNumber, String shipmentMemo) {
        String nextCourier = trimToNull(courier);
        String nextTrackingNumber = trimToNull(trackingNumber);
        String nextShipmentMemo = trimToNull(shipmentMemo);

        if (orderStatus == OrderStatus.SHIPPING || orderStatus == OrderStatus.DELIVERED) {
            requireShipmentInfo(nextCourier, nextTrackingNumber);
        }

        this.courier = nextCourier;
        this.trackingNumber = nextTrackingNumber;
        this.shipmentMemo = nextShipmentMemo;
    }

    // 관리자 주문 처리는 아래 흐름으로만 이동할 수 있습니다.
    // ORDERED -> PAID -> PREPARING -> SHIPPING -> DELIVERED
    // ORDERED -> CANCELED
    public void changeStatus(OrderStatus nextStatus) {
        if (orderStatus == nextStatus) {
            return;
        }

        if (!canChangeStatus(orderStatus, nextStatus)) {
            throw new IllegalStateException("변경할 수 없는 주문 상태입니다.");
        }

        if (nextStatus == OrderStatus.SHIPPING) {
            requireShipmentInfo();
            shippedAt = LocalDateTime.now();
        }

        if (nextStatus == OrderStatus.DELIVERED) {
            deliveredAt = LocalDateTime.now();
        }

        orderStatus = nextStatus;
        if (nextStatus == OrderStatus.CANCELED) {
            canceledAt = LocalDateTime.now();
        }
    }

    private boolean canChangeStatus(OrderStatus currentStatus, OrderStatus nextStatus) {
        return switch (currentStatus) {
            case ORDERED -> nextStatus == OrderStatus.PAID || nextStatus == OrderStatus.CANCELED;
            case PAID -> nextStatus == OrderStatus.PREPARING;
            case PREPARING -> nextStatus == OrderStatus.SHIPPING;
            case SHIPPING -> nextStatus == OrderStatus.DELIVERED;
            case DELIVERED, CANCELED -> false;
        };
    }

    public void completePayment() {
        if (orderStatus == OrderStatus.PAID) {
            return;
        }

        if (orderStatus != OrderStatus.ORDERED) {
            throw new IllegalStateException("결제 완료 처리할 수 없는 주문 상태입니다.");
        }

        orderStatus = OrderStatus.PAID;
    }

    private void requireShipmentInfo() {
        requireShipmentInfo(courier, trackingNumber);
    }

    private void requireShipmentInfo(String courier, String trackingNumber) {
        if (courier == null || courier.isBlank() || trackingNumber == null || trackingNumber.isBlank()) {
            throw new IllegalStateException("배송중 처리하려면 택배사와 송장번호가 필요합니다.");
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        orderedAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

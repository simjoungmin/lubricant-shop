package com.lubricantshop.back.domain.payment;

import com.lubricantshop.back.domain.order.Order;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private PaymentProvider provider;

    @Column(name = "payment_key", nullable = false, unique = true, length = 200)
    private String paymentKey;

    @Column(name = "pg_order_id", nullable = false, length = 64)
    private String pgOrderId;

    @Column(name = "amount", nullable = false, precision = 12, scale = 0)
    private BigDecimal amount;

    @Column(name = "method", length = 40)
    private String method;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "approved_at", length = 40)
    private String approvedAt;

    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Payment() {
    }

    public Payment(
            Order order,
            PaymentProvider provider,
            String paymentKey,
            String pgOrderId,
            BigDecimal amount,
            String method,
            String status,
            String approvedAt,
            String rawResponse
    ) {
        this.order = order;
        this.provider = provider;
        this.paymentKey = paymentKey;
        this.pgOrderId = pgOrderId;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.approvedAt = approvedAt;
        this.rawResponse = rawResponse;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public Order getOrder() {
        return order;
    }

    public PaymentProvider getProvider() {
        return provider;
    }

    public String getPaymentKey() {
        return paymentKey;
    }

    public String getPgOrderId() {
        return pgOrderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getMethod() {
        return method;
    }

    public String getStatus() {
        return status;
    }

    public String getApprovedAt() {
        return approvedAt;
    }

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}

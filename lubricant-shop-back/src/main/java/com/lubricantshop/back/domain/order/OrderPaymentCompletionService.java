package com.lubricantshop.back.domain.order;

import com.lubricantshop.back.domain.cart.CartRepository;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.global.exception.ConflictException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrderPaymentCompletionService {

    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;

    public OrderPaymentCompletionService(
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository
    ) {
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
    }

    public void validateReadyToComplete(Order order) {
        if (order.getOrderStatus() == OrderStatus.PAID) {
            return;
        }

        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new ConflictException("주문 접수 상태에서만 결제 완료 처리할 수 있습니다.");
        }

        List<OrderItem> orderItems = findOrderItems(order);
        for (OrderItem orderItem : orderItems) {
            validatePurchasableProduct(orderItem.getProduct(), orderItem.getQuantity());
        }
    }

    public void completePayment(Order order) {
        if (order.getOrderStatus() == OrderStatus.PAID) {
            return;
        }

        validateReadyToComplete(order);

        List<OrderItem> orderItems = findOrderItems(order);
        for (OrderItem orderItem : orderItems) {
            orderItem.getProduct().decreaseStock(orderItem.getQuantity());
        }

        if (order.getPointUsed() > 0) {
            order.getMember().usePoints(order.getPointUsed());
        }
        order.getMember().earnPoints(order.getPointEarned());
        order.completePayment();
        cartRepository.deleteByMember_MemberId(order.getMember().getMemberId());
    }

    private List<OrderItem> findOrderItems(Order order) {
        return orderItemRepository.findByOrderOrderIdOrderByOrderItemIdAsc(order.getOrderId());
    }

    private void validatePurchasableProduct(Product product, int quantity) {
        if (product.getSaleStatus() != ProductStatus.ON_SALE) {
            throw new ConflictException("현재 구매할 수 없는 상품이 포함되어 있습니다.");
        }

        if (product.getStock() < quantity) {
            throw new ConflictException("상품 재고가 부족합니다.");
        }
    }
}

import type { OrderStatus, PaymentMethod } from "@/components/admin/admin.api";

export const orderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문 접수",
  PAID: "결제 완료",
  PREPARING: "상품 준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송 완료",
  CANCELED: "주문 취소",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

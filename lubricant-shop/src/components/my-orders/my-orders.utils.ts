import type { OrderStatus } from "@/components/admin/admin.api";
import type { MyOrderSummary } from "@/components/order/order.api";

export const orderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문접수",
  PAID: "결제완료",
  PREPARING: "상품준비",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELED: "주문취소",
};

export const orderStatusTone: Record<OrderStatus, string> = {
  ORDERED: "bg-[#fff3ef] text-[#ff4b1f]",
  PAID: "bg-[#edf7ef] text-[#1f6b3a]",
  PREPARING: "bg-[#fff8e7] text-[#8a5a00]",
  SHIPPING: "bg-[#fff3ef] text-[#ff4b1f]",
  DELIVERED: "bg-[#edf7ef] text-[#1f6b3a]",
  CANCELED: "bg-[#f1f4f8] text-[#65717f]",
};

export const formatOrderPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

export const formatOrderDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const formatOrderDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));

export const getOrderTitle = (order: MyOrderSummary) => {
  if (order.itemCount <= 1) {
    return order.representativeProductName;
  }

  return `${order.representativeProductName} 외 ${order.itemCount - 1}건`;
};

export const countOrdersByStatus = (orders: MyOrderSummary[], status: OrderStatus) =>
  orders.filter((order) => order.orderStatus === status).length;

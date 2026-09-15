import type { OrderStatus, PaymentMethod } from "@/components/admin/admin.api";

export const adminOrderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문접수",
  PAID: "결제완료",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELED: "취소",
};

export const adminPaymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

export const adminOrderStatusOptions = Object.keys(adminOrderStatusLabel) as OrderStatus[];

export const getNextAdminOrderStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
  if (currentStatus === "ORDERED") {
    return ["ORDERED", "PAID", "CANCELED"];
  }

  if (currentStatus === "PAID") {
    return ["PAID", "PREPARING"];
  }

  if (currentStatus === "PREPARING") {
    return ["PREPARING", "SHIPPING"];
  }

  if (currentStatus === "SHIPPING") {
    return ["SHIPPING", "DELIVERED"];
  }

  return [currentStatus];
};

export const getAdminOrderPrimaryAction = (
  currentStatus: OrderStatus,
): { label: string; nextStatus: OrderStatus } | null => {
  if (currentStatus === "PAID") {
    return { label: "상품 준비중 처리", nextStatus: "PREPARING" };
  }

  if (currentStatus === "PREPARING") {
    return { label: "배송중 처리", nextStatus: "SHIPPING" };
  }

  if (currentStatus === "SHIPPING") {
    return { label: "배송완료 처리", nextStatus: "DELIVERED" };
  }

  return null;
};

export const formatAdminOrderDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const hasRequiredAdminShipmentInfo = ({
  courier,
  trackingNumber,
}: {
  courier?: string | null;
  trackingNumber?: string | null;
}) => Boolean(courier?.trim() && trackingNumber?.trim());

export const getAdminOrderStatusClassName = (status: OrderStatus) => {
  if (status === "DELIVERED") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "CANCELED") {
    return "border-red-500/40 bg-red-500/10 text-red-300";
  }

  if (status === "SHIPPING") {
    return "border-sky-500/40 bg-sky-500/10 text-sky-300";
  }

  return "border-[#d6a84f]/40 bg-[#d6a84f]/10 text-[#d6a84f]";
};

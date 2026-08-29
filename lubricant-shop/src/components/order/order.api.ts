import type { OrderStatus, PaymentMethod } from "@/components/admin/admin.api";

export type OrderCreateInput = {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  receiverName: string;
  receiverPhone: string;
  deliveryRequest: string;
  usePoints: boolean;
  pointAmount: number;
};

export type OrderCreateResponse = {
  orderId: number;
  orderNumber: string;
  totalOrderAmount: number;
  paymentAmount: number;
  pointUseConfirmed: boolean;
  pointUsed: number;
  pointEarned: number;
  remainingPointBalance: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
};

export type MyOrderItem = {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  pointEarned: number;
};

export type MyOrderSummary = {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  totalOrderAmount: number;
  paymentAmount: number;
  representativeProductName: string;
  itemCount: number;
  totalQuantity: number;
  orderedAt: string;
};

export type MyOrderDetail = {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  totalOrderAmount: number;
  paymentAmount: number;
  pointUsed: number;
  pointEarned: number;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  deliveryRequest: string | null;
  courier: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  orderedAt: string;
  updatedAt: string;
  items: MyOrderItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const requestJson = async <ResponseBody>(path: string, init?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "주문 요청 처리에 실패했습니다.");
  }

  return (await response.json()) as ResponseBody;
};

export const orderApi = {
  createOrder: (input: OrderCreateInput) =>
    requestJson<OrderCreateResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  findMyOrders: () => requestJson<MyOrderSummary[]>("/api/orders/my"),

  findMyOrder: (orderId: number) =>
    requestJson<MyOrderDetail>(`/api/orders/my/${orderId}`),
};

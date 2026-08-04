const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type ProductStatus = "ON_SALE" | "SOLD_OUT" | "STOPPED" | "HIDDEN";
export type OrderStatus = "ORDERED" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED" | "CANCELED";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "VIRTUAL_ACCOUNT" | "CASH";

export type AdminProduct = {
  productId: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  productDescription: string;
  viscosity: string;
  specification: string;
  volume: string;
  imageUrl: string;
  saleStatus: ProductStatus;
  pointRewardRatePercent: number;
  mainProduct: boolean;
  recommended: boolean;
  updatedAt: string;
};

export type AdminOrderItem = {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  pointRewardRatePercent: number;
  pointEarned: number;
};

export type AdminOrder = {
  orderId: number;
  orderNumber: string;
  memberId: number;
  memberName: string;
  memberEmail: string;
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
  orderedAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
};

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
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? "요청 처리에 실패했습니다.");
  }

  return (await response.json()) as ResponseBody;
};

export const adminApi = {
  findProducts: () => requestJson<AdminProduct[]>("/api/admin/products"),

  updateProduct: (productId: number, input: { stock: number; saleStatus: ProductStatus }) =>
    requestJson<AdminProduct>(`/api/admin/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  findOrders: () => requestJson<AdminOrder[]>("/api/admin/orders"),

  updateOrderStatus: (orderId: number, orderStatus: OrderStatus) =>
    requestJson<AdminOrder>(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus }),
    }),
};

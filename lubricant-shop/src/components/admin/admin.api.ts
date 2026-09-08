const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type ProductStatus = "ON_SALE" | "SOLD_OUT" | "STOPPED" | "HIDDEN";
export type OrderStatus = "ORDERED" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED" | "CANCELED";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "VIRTUAL_ACCOUNT" | "CASH";

export type AdminProduct = {
  productId: number;
  productName: string;
  category: string;
  subCategory: string | null;
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
  createdAt: string;
  updatedAt: string;
};

export type AdminProductUpdateInput = Partial<{
  productName: string;
  category: string;
  subCategory: string;
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
}>;

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
  courier: string | null;
  trackingNumber: string | null;
  shipmentMemo: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  orderedAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
};

export type AdminOrderShipmentUpdateInput = {
  courier: string;
  trackingNumber: string;
  shipmentMemo: string;
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

  findProduct: (productId: number) =>
    requestJson<AdminProduct>(`/api/admin/products/${productId}`),

  updateProduct: (productId: number, input: AdminProductUpdateInput) =>
    requestJson<AdminProduct>(`/api/admin/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  findOrders: () => requestJson<AdminOrder[]>("/api/admin/orders"),

  findOrder: (orderId: number) =>
    requestJson<AdminOrder>(`/api/admin/orders/${orderId}`),

  updateOrderStatus: (
    orderId: number,
    orderStatus: OrderStatus,
    shipment?: Partial<AdminOrderShipmentUpdateInput>,
  ) =>
    requestJson<AdminOrder>(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus, ...shipment }),
    }),

  updateOrderShipment: (orderId: number, input: AdminOrderShipmentUpdateInput) =>
    requestJson<AdminOrder>(`/api/admin/orders/${orderId}/shipment`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  completeOrderPayment: (orderId: number) =>
    requestJson<AdminOrder>(`/api/admin/orders/${orderId}/payment-complete`, {
      method: "POST",
    }),
};

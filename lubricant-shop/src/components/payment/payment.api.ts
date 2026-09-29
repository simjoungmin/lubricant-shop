import type { OrderStatus } from "@/components/admin/admin.api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type PaymentConfirmInput = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type PaymentConfirmResponse = {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentAmount: number;
  paymentKey: string;
  paymentMethod: string | null;
  approvedAt: string | null;
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
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "결제 승인 처리에 실패했습니다.");
  }

  return (await response.json()) as ResponseBody;
};

export const paymentApi = {
  confirmPayment: (input: PaymentConfirmInput) =>
    requestJson<PaymentConfirmResponse>("/api/payments/confirm", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

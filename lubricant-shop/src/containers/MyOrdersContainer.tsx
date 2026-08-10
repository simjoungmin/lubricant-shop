"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { formatPrice } from "@/components/cart/cart.utils";
import type { OrderStatus } from "@/components/admin/admin.api";
import OilHeader from "@/components/layout/OilHeader";
import { useMyOrders } from "@/hooks/useMyOrders";
import Link from "next/link";

const orderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문 접수",
  PAID: "결제 완료",
  PREPARING: "상품 준비",
  SHIPPING: "배송 중",
  DELIVERED: "배송 완료",
  CANCELED: "주문 취소",
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getOrderTitle = (representativeProductName: string, itemCount: number) => {
  if (itemCount <= 1) {
    return representativeProductName;
  }

  return `${representativeProductName} 외 ${itemCount - 1}건`;
};

export default function MyOrdersContainer() {
  const { user, isReady } = useAuth();
  const ordersQuery = useMyOrders(isReady && Boolean(user));
  const orders = ordersQuery.data ?? [];

  const guardMessage = !isReady
    ? "주문 내역을 불러오는 중입니다."
    : !user
      ? "로그인 후 주문 내역을 확인할 수 있습니다."
      : ordersQuery.isPending
        ? "주문 내역을 불러오는 중입니다."
        : ordersQuery.isError
          ? ordersQuery.error.message
          : orders.length === 0 ? "아직 주문 내역이 없습니다." : "";

  return (
    <>
      <OilHeader />

      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1080px] px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/my-page" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
            내 정보로 돌아가기
          </Link>
          <p className="mt-8 text-sm font-black text-[#d6a84f]">MY ORDERS</p>
          <h1 className="mt-3 text-3xl font-black text-white">주문 내역</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            주문한 상품과 현재 처리 상태를 확인합니다.
          </p>
        </div>

        {guardMessage ? (
          <section className="mb-5 rounded-lg border border-white/10 bg-[#171611] p-6">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
            {isReady && !user ? (
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
              >
                로그인하러 가기
              </Link>
            ) : null}
          </section>
        ) : null}

        <section className="grid gap-3">
          {orders.map((order) => (
            <Link
              key={order.orderId}
              href={`/my-page/orders/${order.orderId}`}
              className="group rounded-lg border border-white/10 bg-[#171611] p-5 transition hover:border-[#d6a84f]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#d6a84f] px-2 py-1 text-xs font-black text-black">
                      {orderStatusLabel[order.orderStatus]}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {order.orderNumber}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-black text-white">
                    {getOrderTitle(order.representativeProductName, order.itemCount)}
                  </h2>
                  <p className="mt-2 text-sm font-bold text-zinc-500">
                    {formatDateTime(order.orderedAt)} · 총 {order.totalQuantity.toLocaleString("ko-KR")}개
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xl font-black text-[#d6a84f]">
                    {formatPrice(order.paymentAmount)}
                  </p>
                  <p className="mt-2 text-xs font-black text-zinc-500 transition group-hover:text-[#d6a84f]">
                    상세 보기
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}

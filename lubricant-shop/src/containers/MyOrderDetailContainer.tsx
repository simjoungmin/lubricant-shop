"use client";

import type { OrderStatus, PaymentMethod } from "@/components/admin/admin.api";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { formatPrice } from "@/components/cart/cart.utils";
import OilHeader from "@/components/layout/OilHeader";
import { useMyOrder } from "@/hooks/useMyOrders";
import Link from "next/link";

type MyOrderDetailContainerProps = {
  orderId: number;
};

const orderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문 접수",
  PAID: "결제 완료",
  PREPARING: "상품 준비",
  SHIPPING: "배송 중",
  DELIVERED: "배송 완료",
  CANCELED: "주문 취소",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function MyOrderDetailContainer({
  orderId,
}: MyOrderDetailContainerProps) {
  const { user, isReady } = useAuth();
  const orderQuery = useMyOrder(orderId, isReady && Boolean(user));
  const order = orderQuery.data ?? null;

  const guardMessage = !isReady
    ? "주문 정보를 불러오는 중입니다."
    : !user
      ? "로그인 후 주문 상세를 확인할 수 있습니다."
      : orderQuery.isPending
        ? "주문 정보를 불러오는 중입니다."
        : orderQuery.isError
          ? orderQuery.error.message
          : "";

  return (
    <>
      <OilHeader />

      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1080px] px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/my-page/orders" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
            주문 내역으로 돌아가기
          </Link>
          <p className="mt-8 text-sm font-black text-[#d6a84f]">ORDER DETAIL</p>
          <h1 className="mt-3 text-3xl font-black text-white">주문 상세</h1>
        </div>

        {guardMessage ? (
          <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
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

        {order ? (
          <div className="grid gap-5">
            <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="rounded-md bg-[#d6a84f] px-2 py-1 text-xs font-black text-black">
                    {orderStatusLabel[order.orderStatus]}
                  </span>
                  <h2 className="mt-4 text-2xl font-black text-white">{order.orderNumber}</h2>
                  <p className="mt-2 text-sm font-bold text-zinc-500">
                    {formatDateTime(order.orderedAt)}
                  </p>
                </div>
                <p className="text-2xl font-black text-[#d6a84f]">
                  {formatPrice(order.paymentAmount)}
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <h2 className="text-xl font-black text-white">주문 상품</h2>
              <div className="mt-5 grid gap-3">
                {order.items.map((item) => (
                  <article key={item.orderItemId} className="rounded-md bg-black/20 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-black text-white">{item.productName}</p>
                        <p className="mt-2 text-sm font-bold text-zinc-500">
                          {item.quantity.toLocaleString("ko-KR")}개 · {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-black text-zinc-200">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
                <h2 className="text-xl font-black text-white">배송 정보</h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">수령인</dt>
                    <dd className="font-black text-white">{order.receiverName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">연락처</dt>
                    <dd className="font-black text-white">{order.receiverPhone}</dd>
                  </div>
                  <div className="grid gap-2">
                    <dt className="font-bold text-zinc-500">배송지</dt>
                    <dd className="font-bold leading-6 text-white">{order.shippingAddress}</dd>
                  </div>
                  {order.deliveryRequest ? (
                    <div className="grid gap-2">
                      <dt className="font-bold text-zinc-500">배송 요청</dt>
                      <dd className="font-bold leading-6 text-zinc-300">{order.deliveryRequest}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>

              <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
                <h2 className="text-xl font-black text-white">결제 정보</h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">결제 수단</dt>
                    <dd className="font-black text-white">{paymentMethodLabel[order.paymentMethod]}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">상품 금액</dt>
                    <dd className="font-black text-white">{formatPrice(order.totalOrderAmount)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">사용 포인트</dt>
                    <dd className="font-black text-white">{order.pointUsed.toLocaleString("ko-KR")} P</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold text-zinc-500">적립 포인트</dt>
                    <dd className="font-black text-[#d6a84f]">{order.pointEarned.toLocaleString("ko-KR")} P</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                    <dt className="font-black text-white">최종 결제 금액</dt>
                    <dd className="font-black text-[#d6a84f]">{formatPrice(order.paymentAmount)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}

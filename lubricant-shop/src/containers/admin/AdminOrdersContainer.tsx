"use client";

import {
  type AdminOrder,
  type OrderStatus,
  type PaymentMethod,
} from "@/components/admin/admin.api";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { formatPrice } from "@/components/cart/cart.utils";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminOrders, useUpdateAdminOrderStatus } from "@/hooks/useAdminOrders";
import Link from "next/link";
import { useMemo, useState } from "react";  

const orderStatusLabel: Record<OrderStatus, string> = {
  ORDERED: "주문접수",
  PAID: "결제완료",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELED: "취소",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: "카드",
  BANK_TRANSFER: "무통장입금",
  VIRTUAL_ACCOUNT: "가상계좌",
  CASH: "현금",
};

const statusOptions = Object.keys(orderStatusLabel) as OrderStatus[];
const emptyOrders: AdminOrder[] = [];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getStatusClassName = (status: OrderStatus) => {
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

export default function AdminOrdersContainer() {
  const { user, isReady } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [drafts, setDrafts] = useState<Record<number, OrderStatus>>({});
  const [message, setMessage] = useState("");
  const ordersQuery = useAdminOrders(isReady && isAdmin);
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();
  const orders = ordersQuery.data ?? emptyOrders;

  const summary = useMemo(() => {
    const preparingCount = orders.filter((order) => order.orderStatus === "PREPARING").length;
    const shippingCount = orders.filter((order) => order.orderStatus === "SHIPPING").length;
    const orderedCount = orders.filter((order) => order.orderStatus === "ORDERED" || order.orderStatus === "PAID").length;
    const salesAmount = orders
      .filter((order) => order.orderStatus !== "CANCELED")
      .reduce((total, order) => total + order.paymentAmount, 0);

    return { preparingCount, shippingCount, orderedCount, salesAmount };
  }, [orders]);

  const saveOrderStatus = async (orderId: number) => {
    const nextStatus = drafts[orderId];
    if (!nextStatus) {
      return;
    }

    setMessage("");

    try {
      const updatedOrder = await updateOrderStatusMutation.mutateAsync({
        orderId,
        orderStatus: nextStatus,
      });
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [orderId]: updatedOrder.orderStatus,
      }));
      setMessage(`${updatedOrder.orderNumber} 주문 상태가 저장되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "주문 상태 저장에 실패했습니다.");
    }
  };

  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 주문을 관리할 수 있습니다."
      : ordersQuery.isPending
        ? "주문 데이터를 불러오는 중입니다."
        : ordersQuery.isError
          ? ordersQuery.error.message
          : message || (orders.length === 0 ? "접수된 주문이 없습니다." : "");

  return (
    <>
      <OilHeader />
      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1280px] px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
              관리자 홈
            </Link>
            <p className="mt-6 text-sm font-black text-[#d6a84f]">ORDERS</p>
            <h1 className="mt-3 text-3xl font-black text-white">주문 관리</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              접수된 주문의 상품, 배송지, 포인트, 처리 상태를 확인합니다.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
          >
            재고 관리로 이동
          </Link>
        </div>

        {isReady && isAdmin ? (
          <section className="mb-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">전체 주문</p>
              <p className="mt-2 text-2xl font-black text-white">{orders.length}건</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">접수/결제</p>
              <p className="mt-2 text-2xl font-black text-[#d6a84f]">{summary.orderedCount}건</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">출고 대기</p>
              <p className="mt-2 text-2xl font-black text-white">{summary.preparingCount}건</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">결제 합계</p>
              <p className="mt-2 text-2xl font-black text-white">{formatPrice(summary.salesAmount)}</p>
            </div>
          </section>
        ) : null}

        {guardMessage ? (
          <section className="mb-5 rounded-lg border border-white/10 bg-[#171611] p-5">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
            {isReady && !isAdmin ? (
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
              >
                로그인하러 가기
              </Link>
            ) : null}
          </section>
        ) : null}

        {isReady && isAdmin ? (
          <section className="grid gap-4">
            {orders.map((order) => {
              const draftStatus = drafts[order.orderId] ?? order.orderStatus;
              const isChanged = draftStatus !== order.orderStatus;

              return (
                <article key={order.orderId} className="rounded-lg border border-white/10 bg-[#171611] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-black ${getStatusClassName(order.orderStatus)}`}>
                          {orderStatusLabel[order.orderStatus]}
                        </span>
                        <span className="text-sm font-black text-white">{order.orderNumber}</span>
                        <span className="text-xs font-bold text-zinc-500">{formatDateTime(order.orderedAt)}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-black text-white">
                        {order.receiverName} · {order.receiverPhone}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-400">
                        {order.shippingAddress}
                      </p>
                      {order.deliveryRequest ? (
                        <p className="mt-2 text-xs font-bold text-[#d6a84f]">
                          배송 요청: {order.deliveryRequest}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={draftStatus}
                        onChange={(event) =>
                          setDrafts((prevDrafts) => ({
                            ...prevDrafts,
                            [order.orderId]: event.target.value as OrderStatus,
                          }))
                        }
                        className="h-10 rounded-md border border-white/10 bg-[#11100d] px-3 text-sm font-bold text-white outline-none focus:border-[#d6a84f]"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {orderStatusLabel[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!isChanged || updateOrderStatusMutation.isPending}
                        onClick={() => saveOrderStatus(order.orderId)}
                        className="h-10 rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                      >
                        {updateOrderStatusMutation.isPending ? "저장 중" : "상태 저장"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    <div className="rounded-md bg-black/20 p-3">
                      <p className="text-xs font-bold text-zinc-500">주문자</p>
                      <p className="mt-1 text-sm font-black text-zinc-200">{order.memberName}</p>
                      <p className="mt-1 text-xs text-zinc-500">{order.memberEmail}</p>
                    </div>
                    <div className="rounded-md bg-black/20 p-3">
                      <p className="text-xs font-bold text-zinc-500">결제수단</p>
                      <p className="mt-1 text-sm font-black text-zinc-200">{paymentMethodLabel[order.paymentMethod]}</p>
                    </div>
                    <div className="rounded-md bg-black/20 p-3">
                      <p className="text-xs font-bold text-zinc-500">상품금액</p>
                      <p className="mt-1 text-sm font-black text-zinc-200">{formatPrice(order.totalOrderAmount)}</p>
                    </div>
                    <div className="rounded-md bg-black/20 p-3">
                      <p className="text-xs font-bold text-zinc-500">포인트</p>
                      <p className="mt-1 text-sm font-black text-zinc-200">
                        사용 {order.pointUsed.toLocaleString("ko-KR")} P
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        적립 {order.pointEarned.toLocaleString("ko-KR")} P
                      </p>
                    </div>
                    <div className="rounded-md bg-black/20 p-3">
                      <p className="text-xs font-bold text-zinc-500">최종 결제</p>
                      <p className="mt-1 text-sm font-black text-[#d6a84f]">{formatPrice(order.paymentAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-md border border-white/10">
                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                      <thead className="bg-black/30 text-xs text-zinc-500">
                        <tr>
                          <th className="px-4 py-3">상품</th>
                          <th className="px-4 py-3">수량</th>
                          <th className="px-4 py-3">단가</th>
                          <th className="px-4 py-3">합계</th>
                          <th className="px-4 py-3">적립</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {order.items.map((item) => (
                          <tr key={item.orderItemId}>
                            <td className="px-4 py-3 font-bold text-zinc-200">{item.productName}</td>
                            <td className="px-4 py-3 text-zinc-300">{item.quantity}개</td>
                            <td className="px-4 py-3 text-zinc-300">{formatPrice(item.price)}</td>
                            <td className="px-4 py-3 font-black text-white">{formatPrice(item.totalPrice)}</td>
                            <td className="px-4 py-3 text-zinc-300">
                              {item.pointEarned.toLocaleString("ko-KR")} P ({item.pointRewardRatePercent}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}
      </main>
    </>
  );
}

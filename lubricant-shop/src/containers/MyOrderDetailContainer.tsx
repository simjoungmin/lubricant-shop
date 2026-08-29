"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { MyOrderItemsCard } from "@/components/my-order/MyOrderItemsCard";
import { MyOrderPaymentCard } from "@/components/my-order/MyOrderPaymentCard";
import { MyOrderShipmentCard } from "@/components/my-order/MyOrderShipmentCard";
import { MyOrderShippingAddressCard } from "@/components/my-order/MyOrderShippingAddressCard";
import { MyOrderSummaryCard } from "@/components/my-order/MyOrderSummaryCard";
import { BankTransferGuide } from "@/components/order/BankTransferGuide";
import { useMyOrder } from "@/hooks/useMyOrders";
import Link from "next/link";

type MyOrderDetailContainerProps = {
  orderId: number;
};

export default function MyOrderDetailContainer({ orderId }: MyOrderDetailContainerProps) {
  const { user, isReady } = useAuth();
  const orderQuery = useMyOrder(orderId, isReady && Boolean(user));
  const order = orderQuery.data ?? null;

  const guardMessage = !isReady
    ? "주문 정보를 불러오는 중입니다."
    : !user
      ? "로그인하면 주문 상세를 확인할 수 있습니다."
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
            <MyOrderSummaryCard order={order} />
            {order.paymentMethod === "BANK_TRANSFER" && order.orderStatus === "ORDERED" ? (
              <BankTransferGuide
                orderNumber={order.orderNumber}
                paymentAmount={order.paymentAmount}
              />
            ) : null}
            <MyOrderItemsCard items={order.items} />
            <div className="grid gap-5 lg:grid-cols-2">
              <MyOrderShippingAddressCard order={order} />
              <MyOrderPaymentCard order={order} />
            </div>
            <MyOrderShipmentCard order={order} />
          </div>
        ) : null}
      </main>
    </>
  );
}

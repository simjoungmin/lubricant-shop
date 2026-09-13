"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { MyPageLayout } from "@/components/my-page/MyPageLayout";
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

      <MyPageLayout activeMenu="orders">
        <section className="w-full max-w-[1080px]">
          <div className="mb-8">
            <Link
              href="/my-page/orders"
              className="text-sm font-bold text-[#65717f] hover:text-[#ff4b1f]"
            >
              주문 내역으로 돌아가기
            </Link>
            <p className="mt-8 text-sm font-black text-[#ff4b1f]">ORDER DETAIL</p>
            <h1 className="mt-3 text-3xl font-black text-[#071d3b]">주문 상세</h1>
          </div>

          {guardMessage ? (
            <section className="rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
              <p className="text-sm font-bold text-[#65717f]">{guardMessage}</p>
              {isReady && !user ? (
                <Link
                  href="/login"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#ff4b1f] px-5 text-sm font-black text-white transition hover:bg-[#e63e16]"
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
        </section>
      </MyPageLayout>
    </>
  );
}

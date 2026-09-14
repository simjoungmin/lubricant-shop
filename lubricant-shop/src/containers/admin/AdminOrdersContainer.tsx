"use client";

import type { AdminOrder, OrderStatus } from "@/components/admin/admin.api";
import { AdminGuardMessage } from "@/components/admin/AdminGuardMessage";
import { AdminOrdersList } from "@/components/admin/order/AdminOrdersList";
import { AdminOrderSummaryCards } from "@/components/admin/order/AdminOrderSummaryCards";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import {
  useAdminOrders,
  useCompleteAdminOrderPayment,
  useUpdateAdminOrderStatus,
} from "@/hooks/useAdminOrders";
import Link from "next/link";
import { useMemo, useState } from "react";

const emptyOrders: AdminOrder[] = [];

export default function AdminOrdersContainer() {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const [drafts, setDrafts] = useState<Record<number, OrderStatus>>({});
  const [message, setMessage] = useState("");
  const ordersQuery = useAdminOrders(isReady && isAdmin);
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();
  const completePaymentMutation = useCompleteAdminOrderPayment();
  const orders = ordersQuery.data ?? emptyOrders;

  const summary = useMemo(() => {
    const preparingCount = orders.filter((order) => order.orderStatus === "PREPARING").length;
    const orderedCount = orders.filter((order) => order.orderStatus === "ORDERED" || order.orderStatus === "PAID").length;
    const salesAmount = orders
      .filter((order) => order.orderStatus !== "CANCELED")
      .reduce((total, order) => total + order.paymentAmount, 0);

    return { preparingCount, orderedCount, salesAmount };
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

  const completePayment = async (orderId: number) => {
    setMessage("");

    try {
      const updatedOrder = await completePaymentMutation.mutateAsync(orderId);
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [orderId]: updatedOrder.orderStatus,
      }));
      setMessage(`${updatedOrder.orderNumber} 결제 완료 처리가 반영되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "결제 완료 처리에 실패했습니다.");
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
        <AdminOrdersHeader />

        {isReady && isAdmin ? (
          <AdminOrderSummaryCards
            totalCount={orders.length}
            orderedCount={summary.orderedCount}
            preparingCount={summary.preparingCount}
            salesAmount={summary.salesAmount}
          />
        ) : null}

        <AdminGuardMessage message={guardMessage} showLoginLink={showLoginLink} className="mb-5" />

        {isReady && isAdmin ? (
          <AdminOrdersList
            orders={orders}
            drafts={drafts}
            isCompletingPayment={completePaymentMutation.isPending}
            isSavingStatus={updateOrderStatusMutation.isPending}
            onChangeDraft={(orderId, status) =>
              setDrafts((prevDrafts) => ({
                ...prevDrafts,
                [orderId]: status,
              }))
            }
            onCompletePayment={(orderId) => void completePayment(orderId)}
            onSaveStatus={(orderId) => void saveOrderStatus(orderId)}
          />
        ) : null}
      </main>
    </>
  );
}

function AdminOrdersHeader() {
  return (
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
  );
}

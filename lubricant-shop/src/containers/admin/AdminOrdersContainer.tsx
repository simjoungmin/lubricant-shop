"use client";

import type { AdminOrder, OrderStatus } from "@/components/admin/admin.api";
import { AdminGuardMessage, type AdminNoticeVariant } from "@/components/admin/AdminGuardMessage";
import { AdminOrdersList } from "@/components/admin/order/AdminOrdersList";
import { AdminOrderSummaryCards } from "@/components/admin/order/AdminOrderSummaryCards";
import { hasRequiredAdminShipmentInfo } from "@/components/admin/order/admin-order.labels";
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
type AdminNotice = {
  message: string;
  variant: AdminNoticeVariant;
};

export default function AdminOrdersContainer() {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const [drafts, setDrafts] = useState<Record<number, OrderStatus>>({});
  const [notice, setNotice] = useState<AdminNotice | null>(null);
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

    const order = orders.find((item) => item.orderId === orderId);
    if (order && nextStatus === "SHIPPING" && !hasRequiredAdminShipmentInfo(order)) {
      setNotice({
        message: "배송중 처리 전 상세에서 택배사와 송장번호를 먼저 저장해 주세요.",
        variant: "error",
      });
      return;
    }

    setNotice(null);

    try {
      const updatedOrder = await updateOrderStatusMutation.mutateAsync({
        orderId,
        orderStatus: nextStatus,
      });
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [orderId]: updatedOrder.orderStatus,
      }));
      setNotice({
        message: `${updatedOrder.orderNumber} 주문 상태가 저장되었습니다.`,
        variant: "success",
      });
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "주문 상태 저장에 실패했습니다.",
        variant: "error",
      });
    }
  };

  const completePayment = async (orderId: number) => {
    setNotice(null);

    try {
      const updatedOrder = await completePaymentMutation.mutateAsync(orderId);
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [orderId]: updatedOrder.orderStatus,
      }));
      setNotice({
        message: `${updatedOrder.orderNumber} 결제 완료 처리가 반영되었습니다.`,
        variant: "success",
      });
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "결제 완료 처리에 실패했습니다.",
        variant: "error",
      });
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
          : notice?.message || (orders.length === 0 ? "접수된 주문이 없습니다." : "");
  const guardVariant: AdminNoticeVariant = ordersQuery.isError
    ? "error"
    : notice?.variant ?? "info";

  return (
    <>
      <OilHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#11100d]">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-8">
        <AdminOrdersHeader />

        {isReady && isAdmin ? (
          <AdminOrderSummaryCards
            totalCount={orders.length}
            orderedCount={summary.orderedCount}
            preparingCount={summary.preparingCount}
            salesAmount={summary.salesAmount}
          />
        ) : null}

        <AdminGuardMessage
          message={guardMessage}
          showLoginLink={showLoginLink}
          className="mb-5"
          variant={guardVariant}
        />

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
        </div>
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

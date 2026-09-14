"use client";

import type {
  AdminOrderShipmentUpdateInput,
  OrderStatus,
} from "@/components/admin/admin.api";
import { AdminGuardMessage } from "@/components/admin/AdminGuardMessage";
import {
  adminOrderStatusLabel,
  getAdminOrderStatusClassName,
} from "@/components/admin/order/admin-order.labels";
import { AdminOrderDetailView } from "@/components/admin/order/AdminOrderDetailView";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import {
  useAdminOrder,
  useCompleteAdminOrderPayment,
  useUpdateAdminOrderShipment,
  useUpdateAdminOrderStatus,
} from "@/hooks/useAdminOrders";
import Link from "next/link";
import { useState } from "react";

type AdminOrderDetailContainerProps = {
  orderId: number;
};

export default function AdminOrderDetailContainer({
  orderId,
}: AdminOrderDetailContainerProps) {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const orderQuery = useAdminOrder(orderId, isReady && isAdmin);
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();
  const updateOrderShipmentMutation = useUpdateAdminOrderShipment();
  const completePaymentMutation = useCompleteAdminOrderPayment();
  const [draftStatus, setDraftStatus] = useState<OrderStatus | null>(null);
  const [shipmentDraft, setShipmentDraft] = useState<AdminOrderShipmentUpdateInput>({
    courier: "",
    trackingNumber: "",
    shipmentMemo: "",
  });
  const [message, setMessage] = useState("");

  const order = orderQuery.data;
  const selectedStatus = draftStatus ?? order?.orderStatus ?? "ORDERED";
  const resolvedShipment = {
    courier: shipmentDraft.courier || order?.courier || "",
    trackingNumber: shipmentDraft.trackingNumber || order?.trackingNumber || "",
    shipmentMemo: shipmentDraft.shipmentMemo || order?.shipmentMemo || "",
  };

  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 주문 상세를 확인할 수 있습니다."
      : orderQuery.isPending
        ? "주문 상세를 불러오는 중입니다."
        : orderQuery.isError
          ? orderQuery.error.message
          : message;

  const handleCompletePayment = async () => {
    if (!order) {
      return;
    }

    setMessage("");

    try {
      const updatedOrder = await completePaymentMutation.mutateAsync(order.orderId);
      setDraftStatus(updatedOrder.orderStatus);
      setMessage(`${updatedOrder.orderNumber} 결제 완료 처리가 반영되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "결제 완료 처리에 실패했습니다.");
    }
  };

  const updateStatus = async (nextStatus: OrderStatus) => {
    if (!order || nextStatus === order.orderStatus) {
      return;
    }

    setMessage("");

    try {
      const updatedOrder = await updateOrderStatusMutation.mutateAsync({
        orderId: order.orderId,
        orderStatus: nextStatus,
        shipment: nextStatus === "SHIPPING" ? resolvedShipment : undefined,
      });
      setDraftStatus(updatedOrder.orderStatus);
      setMessage(`${updatedOrder.orderNumber} 주문 상태가 저장되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "주문 상태 저장에 실패했습니다.");
    }
  };

  const handleSaveShipment = async () => {
    if (!order) {
      return;
    }

    setMessage("");

    try {
      const updatedOrder = await updateOrderShipmentMutation.mutateAsync({
        orderId: order.orderId,
        input: resolvedShipment,
      });
      setShipmentDraft({
        courier: updatedOrder.courier ?? "",
        trackingNumber: updatedOrder.trackingNumber ?? "",
        shipmentMemo: updatedOrder.shipmentMemo ?? "",
      });
      setMessage(`${updatedOrder.orderNumber} 배송 정보가 저장되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "배송 정보 저장에 실패했습니다.");
    }
  };

  return (
    <>
      <OilHeader />
      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1180px] px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin/orders" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
              주문 관리로 돌아가기
            </Link>
            <p className="mt-6 text-sm font-black text-[#d6a84f]">ORDER DETAIL</p>
            <h1 className="mt-3 text-3xl font-black text-white">관리자 주문 상세</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              주문 하나의 결제, 배송, 상품 정보를 확인하고 처리 상태를 변경합니다.
            </p>
          </div>
          {order ? (
            <span className={`inline-flex h-9 items-center rounded-md border px-3 text-xs font-black ${getAdminOrderStatusClassName(order.orderStatus)}`}>
              {adminOrderStatusLabel[order.orderStatus]}
            </span>
          ) : null}
        </div>

        <AdminGuardMessage message={guardMessage} showLoginLink={showLoginLink} className="mb-5" />

        {order ? (
          <AdminOrderDetailView
            order={order}
            selectedStatus={selectedStatus}
            shipmentDraft={resolvedShipment}
            onChangeStatus={(status) => {
              setDraftStatus(status);
              setMessage("");
            }}
            onChangeShipment={(field, value) => {
              setShipmentDraft((currentDraft) => ({
                ...currentDraft,
                [field]: value,
              }));
              setMessage("");
            }}
            onCompletePayment={handleCompletePayment}
            onSaveStatus={() => void updateStatus(selectedStatus)}
            onUpdateStatus={(status) => void updateStatus(status)}
            onSaveShipment={() => void handleSaveShipment()}
            isCompletingPayment={completePaymentMutation.isPending}
            isSavingStatus={updateOrderStatusMutation.isPending}
            isSavingShipment={updateOrderShipmentMutation.isPending}
          />
        ) : null}
      </main>
    </>
  );
}

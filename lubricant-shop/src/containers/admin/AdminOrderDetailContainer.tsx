"use client";

import type {
  AdminOrder,
  AdminOrderShipmentUpdateInput,
  OrderStatus,
} from "@/components/admin/admin.api";
import { AdminGuardMessage, type AdminNoticeVariant } from "@/components/admin/AdminGuardMessage";
import {
  adminOrderStatusLabel,
  getAdminOrderStatusClassName,
  hasRequiredAdminShipmentInfo,
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

type AdminNotice = {
  message: string;
  variant: AdminNoticeVariant;
};

type DraftStatusState = {
  orderId: number;
  status: OrderStatus;
};

type ShipmentDraftState = {
  orderId: number;
  shipment: AdminOrderShipmentUpdateInput;
};

const emptyShipmentDraft: AdminOrderShipmentUpdateInput = {
  courier: "",
  trackingNumber: "",
  shipmentMemo: "",
};

const toShipmentDraft = (order: AdminOrder | undefined): AdminOrderShipmentUpdateInput => {
  if (!order) {
    return emptyShipmentDraft;
  }

  return {
    courier: order.courier ?? "",
    trackingNumber: order.trackingNumber ?? "",
    shipmentMemo: order.shipmentMemo ?? "",
  };
};

export default function AdminOrderDetailContainer({
  orderId,
}: AdminOrderDetailContainerProps) {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const orderQuery = useAdminOrder(orderId, isReady && isAdmin);
  const updateOrderStatusMutation = useUpdateAdminOrderStatus();
  const updateOrderShipmentMutation = useUpdateAdminOrderShipment();
  const completePaymentMutation = useCompleteAdminOrderPayment();
  const [draftStatus, setDraftStatus] = useState<DraftStatusState | null>(null);
  const [shipmentDraft, setShipmentDraft] = useState<ShipmentDraftState | null>(null);
  const [notice, setNotice] = useState<AdminNotice | null>(null);

  const order = orderQuery.data;
  const selectedStatus = order && draftStatus?.orderId === order.orderId
    ? draftStatus.status
    : order?.orderStatus ?? "ORDERED";
  const resolvedShipment = order && shipmentDraft?.orderId === order.orderId
    ? shipmentDraft.shipment
    : toShipmentDraft(order);

  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 주문 상세를 확인할 수 있습니다."
      : orderQuery.isPending
        ? "주문 상세를 불러오는 중입니다."
        : orderQuery.isError
          ? orderQuery.error.message
          : notice?.message ?? "";
  const guardVariant: AdminNoticeVariant = orderQuery.isError
    ? "error"
    : notice?.variant ?? "info";

  const handleCompletePayment = async () => {
    if (!order) {
      return;
    }

    setNotice(null);

    try {
      const updatedOrder = await completePaymentMutation.mutateAsync(order.orderId);
      setDraftStatus({
        orderId: updatedOrder.orderId,
        status: updatedOrder.orderStatus,
      });
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

  const updateStatus = async (nextStatus: OrderStatus) => {
    if (!order || nextStatus === order.orderStatus) {
      return;
    }

    setNotice(null);

    if (nextStatus === "SHIPPING" && !hasRequiredAdminShipmentInfo(resolvedShipment)) {
      setNotice({
        message: "배송중 처리 전 택배사와 송장번호를 입력해 주세요.",
        variant: "error",
      });
      return;
    }

    try {
      const updatedOrder = await updateOrderStatusMutation.mutateAsync({
        orderId: order.orderId,
        orderStatus: nextStatus,
        shipment: nextStatus === "SHIPPING" ? resolvedShipment : undefined,
      });
      setDraftStatus({
        orderId: updatedOrder.orderId,
        status: updatedOrder.orderStatus,
      });
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

  const handleSaveShipment = async () => {
    if (!order) {
      return;
    }

    setNotice(null);

    if (
      (order.orderStatus === "SHIPPING" || order.orderStatus === "DELIVERED")
      && !hasRequiredAdminShipmentInfo(resolvedShipment)
    ) {
      setNotice({
        message: "배송중 또는 배송완료 주문은 택배사와 송장번호를 비울 수 없습니다.",
        variant: "error",
      });
      return;
    }

    try {
      const updatedOrder = await updateOrderShipmentMutation.mutateAsync({
        orderId: order.orderId,
        input: resolvedShipment,
      });
      setShipmentDraft({
        orderId: updatedOrder.orderId,
        shipment: toShipmentDraft(updatedOrder),
      });
      setNotice({
        message: `${updatedOrder.orderNumber} 배송 정보가 저장되었습니다.`,
        variant: "success",
      });
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "배송 정보 저장에 실패했습니다.",
        variant: "error",
      });
    }
  };

  return (
    <>
      <OilHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#11100d]">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-10 lg:px-8">
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

        <AdminGuardMessage
          message={guardMessage}
          showLoginLink={showLoginLink}
          className="mb-5"
          variant={guardVariant}
        />

        {order ? (
          <AdminOrderDetailView
            order={order}
            selectedStatus={selectedStatus}
            shipmentDraft={resolvedShipment}
            onChangeStatus={(status) => {
              setDraftStatus({
                orderId: order.orderId,
                status,
              });
              setNotice(null);
            }}
            onChangeShipment={(field, value) => {
              setShipmentDraft((currentDraft) => {
                const currentShipment = currentDraft?.orderId === order.orderId
                  ? currentDraft.shipment
                  : resolvedShipment;

                return {
                  orderId: order.orderId,
                  shipment: {
                    ...currentShipment,
                    [field]: value,
                  },
                };
              });
              setNotice(null);
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
        </div>
      </main>
    </>
  );
}

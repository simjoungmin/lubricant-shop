"use client";

import type {
  AdminOrder,
  AdminOrderShipmentUpdateInput,
  OrderStatus,
} from "@/components/admin/admin.api";
import {
  formatAdminOrderDateTime,
  hasRequiredAdminShipmentInfo,
} from "@/components/admin/order/admin-order.labels";
import {
  AdminOrderInfoCard,
  AdminOrderInfoRow,
} from "@/components/admin/order/AdminOrderInfoCard";
import { AdminOrderItemsTable } from "@/components/admin/order/AdminOrderItemsTable";
import { AdminOrderPaymentCard } from "@/components/admin/order/AdminOrderPaymentCard";
import { AdminOrderStatusActions } from "@/components/admin/order/AdminOrderStatusActions";
import { AdminShipmentForm } from "@/components/admin/order/AdminShipmentForm";

type ShipmentDraftField = keyof AdminOrderShipmentUpdateInput;

type AdminOrderDetailViewProps = {
  order: AdminOrder;
  selectedStatus: OrderStatus;
  shipmentDraft: AdminOrderShipmentUpdateInput;
  isCompletingPayment: boolean;
  isSavingStatus: boolean;
  isSavingShipment: boolean;
  onChangeStatus: (status: OrderStatus) => void;
  onChangeShipment: (field: ShipmentDraftField, value: string) => void;
  onCompletePayment: () => void;
  onSaveStatus: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
  onSaveShipment: () => void;
};

export function AdminOrderDetailView({
  order,
  selectedStatus,
  shipmentDraft,
  isCompletingPayment,
  isSavingStatus,
  isSavingShipment,
  onChangeStatus,
  onChangeShipment,
  onCompletePayment,
  onSaveStatus,
  onUpdateStatus,
  onSaveShipment,
}: AdminOrderDetailViewProps) {
  const isChanged = selectedStatus !== order.orderStatus;
  const hasRequiredShipmentInfo = hasRequiredAdminShipmentInfo(shipmentDraft);

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-white/10 bg-[#171611] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black text-[#d6a84f]">주문번호</p>
            <h2 className="mt-2 text-2xl font-black text-white">{order.orderNumber}</h2>
            <p className="mt-2 text-sm text-zinc-500">주문일 {formatAdminOrderDateTime(order.orderedAt)}</p>
            <p className="mt-1 text-sm text-zinc-500">수정일 {formatAdminOrderDateTime(order.updatedAt)}</p>
          </div>

          <AdminOrderStatusActions
            order={order}
            selectedStatus={selectedStatus}
            hasRequiredShipmentInfo={hasRequiredShipmentInfo}
            isChanged={isChanged}
            isCompletingPayment={isCompletingPayment}
            isSavingStatus={isSavingStatus}
            onChangeStatus={onChangeStatus}
            onCompletePayment={onCompletePayment}
            onSaveStatus={onSaveStatus}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <AdminOrderInfoCard title="주문자 정보">
          <AdminOrderInfoRow label="이름" value={order.memberName} />
          <AdminOrderInfoRow label="이메일" value={order.memberEmail} />
          <AdminOrderInfoRow label="회원 번호" value={String(order.memberId)} />
        </AdminOrderInfoCard>

        <AdminOrderInfoCard title="배송지 정보">
          <AdminOrderInfoRow label="받는 사람" value={order.receiverName} />
          <AdminOrderInfoRow label="연락처" value={order.receiverPhone} />
          <AdminOrderInfoRow label="주소" value={order.shippingAddress} />
          <AdminOrderInfoRow label="요청사항" value={order.deliveryRequest || "없음"} />
        </AdminOrderInfoCard>
      </section>

      <AdminShipmentForm
        order={order}
        shipmentDraft={shipmentDraft}
        isSavingShipment={isSavingShipment}
        onChangeShipment={onChangeShipment}
        onSaveShipment={onSaveShipment}
      />

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <AdminOrderItemsTable order={order} />
        <AdminOrderPaymentCard order={order} />
      </section>
    </div>
  );
}

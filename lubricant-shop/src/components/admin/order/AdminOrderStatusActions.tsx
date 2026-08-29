"use client";

import type { AdminOrder, OrderStatus } from "@/components/admin/admin.api";
import {
  adminOrderStatusLabel,
  getAdminOrderPrimaryAction,
  getNextAdminOrderStatusOptions,
} from "@/components/admin/order/admin-order.labels";

type AdminOrderStatusActionsProps = {
  order: AdminOrder;
  selectedStatus: OrderStatus;
  isChanged: boolean;
  isCompletingPayment: boolean;
  isSavingStatus: boolean;
  onChangeStatus: (status: OrderStatus) => void;
  onCompletePayment: () => void;
  onSaveStatus: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
};

export function AdminOrderStatusActions({
  order,
  selectedStatus,
  isChanged,
  isCompletingPayment,
  isSavingStatus,
  onChangeStatus,
  onCompletePayment,
  onSaveStatus,
  onUpdateStatus,
}: AdminOrderStatusActionsProps) {
  const primaryAction = getAdminOrderPrimaryAction(order.orderStatus);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {order.orderStatus === "ORDERED" ? (
        <>
          <button
            type="button"
            disabled={isCompletingPayment}
            onClick={onCompletePayment}
            className="h-10 rounded-md bg-emerald-500 px-4 text-sm font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isCompletingPayment ? "처리 중" : "결제 완료 처리"}
          </button>
          <button
            type="button"
            disabled={isSavingStatus}
            onClick={() => onUpdateStatus("CANCELED")}
            className="h-10 rounded-md border border-red-500/50 px-4 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
          >
            {isSavingStatus ? "처리 중" : "주문 취소 처리"}
          </button>
        </>
      ) : null}

      {primaryAction ? (
        <button
          type="button"
          disabled={isSavingStatus}
          onClick={() => onUpdateStatus(primaryAction.nextStatus)}
          className="h-10 rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isSavingStatus ? "처리 중" : primaryAction.label}
        </button>
      ) : null}

      <select
        value={selectedStatus}
        onChange={(event) => onChangeStatus(event.target.value as OrderStatus)}
        className="h-10 rounded-md border border-white/10 bg-[#11100d] px-3 text-sm font-bold text-white outline-none focus:border-[#d6a84f]"
      >
        {getNextAdminOrderStatusOptions(order.orderStatus).map((status) => (
          <option key={status} value={status}>
            {adminOrderStatusLabel[status]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={!isChanged || isSavingStatus}
        onClick={onSaveStatus}
        className="h-10 rounded-md border border-white/10 px-4 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f] disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
      >
        {isSavingStatus ? "저장 중" : "선택 상태 저장"}
      </button>
    </div>
  );
}

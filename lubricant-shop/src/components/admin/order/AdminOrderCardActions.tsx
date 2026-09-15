import type { AdminOrder, OrderStatus } from "@/components/admin/admin.api";
import {
  adminOrderStatusLabel,
  getNextAdminOrderStatusOptions,
  hasRequiredAdminShipmentInfo,
} from "@/components/admin/order/admin-order.labels";
import Link from "next/link";

type AdminOrderCardActionsProps = {
  order: AdminOrder;
  draftStatus: OrderStatus;
  isChanged: boolean;
  isCompletingPayment: boolean;
  isSavingStatus: boolean;
  onChangeDraft: (orderId: number, status: OrderStatus) => void;
  onCompletePayment: (orderId: number) => void;
  onSaveStatus: (orderId: number) => void;
};

export function AdminOrderCardActions({
  order,
  draftStatus,
  isChanged,
  isCompletingPayment,
  isSavingStatus,
  onChangeDraft,
  onCompletePayment,
  onSaveStatus,
}: AdminOrderCardActionsProps) {
  const isShippingWithoutShipment =
    draftStatus === "SHIPPING" && !hasRequiredAdminShipmentInfo(order);
  const isSaveDisabled = !isChanged || isSavingStatus || isShippingWithoutShipment;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/admin/orders/${order.orderId}`}
          className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
        >
          상세 보기
        </Link>
        {order.orderStatus === "ORDERED" ? (
          <button
            type="button"
            disabled={isCompletingPayment}
            onClick={() => onCompletePayment(order.orderId)}
            className="h-10 rounded-md bg-emerald-500 px-4 text-sm font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isCompletingPayment ? "처리 중" : "결제 완료 처리"}
          </button>
        ) : null}
        <select
          value={draftStatus}
          onChange={(event) => onChangeDraft(order.orderId, event.target.value as OrderStatus)}
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
          disabled={isSaveDisabled}
          onClick={() => onSaveStatus(order.orderId)}
          title={isShippingWithoutShipment ? "배송중 처리 전 택배사와 송장번호가 필요합니다." : undefined}
          className="h-10 rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {isSavingStatus ? "저장 중" : "상태 저장"}
        </button>
      </div>
      {isShippingWithoutShipment ? (
        <p className="text-xs font-bold text-red-300">
          배송중 처리는 상세에서 택배사와 송장번호를 먼저 저장해 주세요.
        </p>
      ) : null}
    </div>
  );
}

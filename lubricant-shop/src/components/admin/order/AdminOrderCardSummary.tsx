import type { AdminOrder } from "@/components/admin/admin.api";
import {
  adminOrderStatusLabel,
  formatAdminOrderDateTime,
  getAdminOrderStatusClassName,
} from "@/components/admin/order/admin-order.labels";

export function AdminOrderCardSummary({ order }: { order: AdminOrder }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-black ${getAdminOrderStatusClassName(order.orderStatus)}`}>
          {adminOrderStatusLabel[order.orderStatus]}
        </span>
        <span className="text-sm font-black text-white">{order.orderNumber}</span>
        <span className="text-xs font-bold text-zinc-500">{formatAdminOrderDateTime(order.orderedAt)}</span>
      </div>
      <h2 className="mt-3 text-xl font-black text-white">
        {order.receiverName} · {order.receiverPhone}
      </h2>
      <p className="mt-2 text-sm text-zinc-400">{order.shippingAddress}</p>
      {order.deliveryRequest ? (
        <p className="mt-2 text-xs font-bold text-[#d6a84f]">
          배송 요청: {order.deliveryRequest}
        </p>
      ) : null}
    </div>
  );
}

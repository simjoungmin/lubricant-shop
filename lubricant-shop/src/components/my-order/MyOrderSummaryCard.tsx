import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderDetail } from "@/components/order/order.api";
import { orderStatusLabel } from "./my-order.labels";
import { formatDateTime } from "./my-order.utils";

type MyOrderSummaryCardProps = {
  order: MyOrderDetail;
};

export function MyOrderSummaryCard({ order }: MyOrderSummaryCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="rounded-md bg-[#d6a84f] px-2 py-1 text-xs font-black text-black">
            {orderStatusLabel[order.orderStatus]}
          </span>
          <h2 className="mt-4 text-2xl font-black text-white">{order.orderNumber}</h2>
          <p className="mt-2 text-sm font-bold text-zinc-500">
            {formatDateTime(order.orderedAt)}
          </p>
        </div>
        <p className="text-2xl font-black text-[#d6a84f]">
          {formatPrice(order.paymentAmount)}
        </p>
      </div>
    </section>
  );
}

import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderDetail } from "@/components/order/order.api";
import { orderStatusLabel } from "./my-order.labels";
import { formatDateTime } from "./my-order.utils";

type MyOrderSummaryCardProps = {
  order: MyOrderDetail;
};

export function MyOrderSummaryCard({ order }: MyOrderSummaryCardProps) {
  return (
    <section className="rounded-lg border border-[#ffd3c5] bg-[#fff8f5] p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="rounded-md bg-[#ff4b1f] px-2 py-1 text-xs font-black text-white">
            {orderStatusLabel[order.orderStatus]}
          </span>
          <h2 className="mt-4 text-2xl font-black text-[#071d3b]">{order.orderNumber}</h2>
          <p className="mt-2 text-sm font-bold text-[#65717f]">
            {formatDateTime(order.orderedAt)}
          </p>
        </div>
        <p className="text-2xl font-black text-[#ff4b1f]">
          {formatPrice(order.paymentAmount)}
        </p>
      </div>
    </section>
  );
}

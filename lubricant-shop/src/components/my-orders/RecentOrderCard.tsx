import type { MyOrderSummary } from "@/components/order/order.api";
import Link from "next/link";
import { formatOrderDateTime, formatOrderPrice, getOrderTitle, orderStatusLabel, orderStatusTone } from "./my-orders.utils";
import { OrderDeliveryProgress } from "./OrderDeliveryProgress";

type RecentOrderCardProps = {
  order: MyOrderSummary;
};

export function RecentOrderCard({ order }: RecentOrderCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#dde2e8] bg-white shadow-[0_18px_48px_rgba(7,29,59,0.07)]">
      <div className="flex flex-col gap-3 border-b border-[#eef1f4] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-md px-3 py-1.5 text-xs font-black ${orderStatusTone[order.orderStatus]}`}>
            {orderStatusLabel[order.orderStatus]}
          </span>
          <span className="text-sm font-black text-[#071d3b]">{formatOrderDateTime(order.orderedAt)}</span>
          <span className="text-sm font-bold text-[#65717f]">주문번호 {order.orderNumber}</span>
        </div>
        <Link
          href={`/my-page/orders/${order.orderId}`}
          className="text-sm font-black text-[#071d3b] transition hover:text-[#ff4b1f]"
        >
          주문 상세보기
        </Link>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <div className="flex h-36 items-center justify-center rounded-lg border border-[#eef1f4] bg-[#f8fafb] text-sm font-black text-[#65717f]">
            상품 이미지
          </div>
          <div>
            <h3 className="text-xl font-black leading-7 text-[#071d3b]">{getOrderTitle(order)}</h3>
            <p className="mt-2 text-sm font-bold text-[#65717f]">
              총 {order.totalQuantity.toLocaleString("ko-KR")}개
            </p>
            <p className="mt-4 text-2xl font-black text-[#071d3b]">
              {formatOrderPrice(order.paymentAmount)}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/my-page/orders/${order.orderId}`}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#071d3b] px-5 text-sm font-black text-[#071d3b] transition hover:bg-[#071d3b] hover:text-white"
              >
                상세 보기
              </Link>
              <button
                className="h-11 cursor-not-allowed rounded-md border border-[#dce2e8] px-5 text-sm font-black text-[#8a95a3]"
                disabled
                type="button"
              >
                리뷰 작성 준비 중
              </button>
            </div>
          </div>
        </div>

        <OrderDeliveryProgress orderStatus={order.orderStatus} />
      </div>
    </article>
  );
}

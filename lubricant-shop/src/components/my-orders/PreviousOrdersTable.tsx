import type { MyOrderSummary } from "@/components/order/order.api";
import Link from "next/link";
import { formatOrderDate, formatOrderPrice, getOrderTitle, orderStatusLabel, orderStatusTone } from "./my-orders.utils";

type PreviousOrdersTableProps = {
  orders: MyOrderSummary[];
};

export function PreviousOrdersTable({ orders }: PreviousOrdersTableProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-black text-[#071d3b]">이전 주문 내역</h2>
        <p className="mt-2 text-sm font-semibold text-[#65717f]">최근 주문을 제외한 주문 목록입니다.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#dde2e8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f8fafb] text-left text-xs font-black text-[#65717f]">
                <th className="px-5 py-4">주문일자</th>
                <th className="px-5 py-4">주문번호</th>
                <th className="px-5 py-4">상품정보</th>
                <th className="px-5 py-4 text-right">주문금액</th>
                <th className="px-5 py-4">주문상태</th>
                <th className="px-5 py-4 text-right">주문관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-t border-[#eef1f4]">
                  <td className="px-5 py-4 font-bold text-[#65717f]">{formatOrderDate(order.orderedAt)}</td>
                  <td className="px-5 py-4 font-black text-[#34465c]">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <p className="font-black text-[#071d3b]">{getOrderTitle(order)}</p>
                    <p className="mt-1 text-xs font-bold text-[#65717f]">
                      총 {order.totalQuantity.toLocaleString("ko-KR")}개
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right font-black text-[#071d3b]">
                    {formatOrderPrice(order.paymentAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-md px-3 py-1.5 text-xs font-black ${orderStatusTone[order.orderStatus]}`}>
                      {orderStatusLabel[order.orderStatus]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/my-page/orders/${order.orderId}`}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-[#071d3b] px-4 text-xs font-black text-white transition hover:bg-[#12345f]"
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

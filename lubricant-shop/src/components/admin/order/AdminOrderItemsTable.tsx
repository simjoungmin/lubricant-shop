import type { AdminOrder } from "@/components/admin/admin.api";
import { formatPrice } from "@/components/cart/cart.utils";

export function AdminOrderItemsTable({ order }: { order: AdminOrder }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#171611]">
      <div className="border-b border-white/10 p-5">
        <p className="text-xs font-black text-[#d6a84f]">ITEMS</p>
        <h2 className="mt-2 text-xl font-black text-white">주문 상품</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-black/30 text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-3">상품</th>
              <th className="px-4 py-3">수량</th>
              <th className="px-4 py-3">단가</th>
              <th className="px-4 py-3">합계</th>
              <th className="px-4 py-3">적립</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {order.items.map((item) => (
              <tr key={item.orderItemId}>
                <td className="px-4 py-3 font-bold text-zinc-200">{item.productName}</td>
                <td className="px-4 py-3 text-zinc-300">{item.quantity}개</td>
                <td className="px-4 py-3 text-zinc-300">{formatPrice(item.price)}</td>
                <td className="px-4 py-3 font-black text-white">{formatPrice(item.totalPrice)}</td>
                <td className="px-4 py-3 text-zinc-300">
                  {item.pointEarned.toLocaleString("ko-KR")} P ({item.pointRewardRatePercent}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

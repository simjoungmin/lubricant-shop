import type { AdminOrder } from "@/components/admin/admin.api";
import { formatPrice } from "@/components/cart/cart.utils";

export function AdminOrderItemsPreview({ order }: { order: AdminOrder }) {
  return (
    <div className="mt-5 overflow-hidden rounded-md border border-white/10">
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
  );
}

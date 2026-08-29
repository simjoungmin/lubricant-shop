import type { AdminOrder } from "@/components/admin/admin.api";
import { adminPaymentMethodLabel } from "@/components/admin/order/admin-order.labels";
import {
  AdminOrderInfoCard,
  AdminOrderInfoRow,
} from "@/components/admin/order/AdminOrderInfoCard";
import { formatPrice } from "@/components/cart/cart.utils";

export function AdminOrderPaymentCard({ order }: { order: AdminOrder }) {
  return (
    <AdminOrderInfoCard title="결제 정보">
      <AdminOrderInfoRow label="결제수단" value={adminPaymentMethodLabel[order.paymentMethod]} />
      <AdminOrderInfoRow label="상품금액" value={formatPrice(order.totalOrderAmount)} />
      <AdminOrderInfoRow label="사용 포인트" value={`${order.pointUsed.toLocaleString("ko-KR")} P`} />
      <AdminOrderInfoRow label="적립 포인트" value={`${order.pointEarned.toLocaleString("ko-KR")} P`} />
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-xs font-bold text-zinc-500">최종 결제 금액</p>
        <p className="mt-2 text-2xl font-black text-[#d6a84f]">{formatPrice(order.paymentAmount)}</p>
      </div>
    </AdminOrderInfoCard>
  );
}

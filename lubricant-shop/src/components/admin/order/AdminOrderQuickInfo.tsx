import type { AdminOrder } from "@/components/admin/admin.api";
import { adminPaymentMethodLabel } from "@/components/admin/order/admin-order.labels";
import { formatPrice } from "@/components/cart/cart.utils";
import type { ReactNode } from "react";

export function AdminOrderQuickInfo({ order }: { order: AdminOrder }) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-5">
      <QuickInfo label="주문자">
        <p className="mt-1 text-sm font-black text-zinc-200">{order.memberName}</p>
        <p className="mt-1 text-xs text-zinc-500">{order.memberEmail}</p>
      </QuickInfo>
      <QuickInfo label="결제수단">
        <p className="mt-1 text-sm font-black text-zinc-200">{adminPaymentMethodLabel[order.paymentMethod]}</p>
      </QuickInfo>
      <QuickInfo label="상품금액">
        <p className="mt-1 text-sm font-black text-zinc-200">{formatPrice(order.totalOrderAmount)}</p>
      </QuickInfo>
      <QuickInfo label="포인트">
        <p className="mt-1 text-sm font-black text-zinc-200">
          사용 {order.pointUsed.toLocaleString("ko-KR")} P
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          적립 {order.pointEarned.toLocaleString("ko-KR")} P
        </p>
      </QuickInfo>
      <QuickInfo label="최종 결제">
        <p className="mt-1 text-sm font-black text-[#d6a84f]">{formatPrice(order.paymentAmount)}</p>
      </QuickInfo>
    </div>
  );
}

function QuickInfo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md bg-black/20 p-3">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      {children}
    </div>
  );
}

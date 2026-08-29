import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderDetail } from "@/components/order/order.api";
import { MyOrderDetailRow } from "./MyOrderDetailRow";
import { paymentMethodLabel } from "./my-order.labels";

type MyOrderPaymentCardProps = {
  order: MyOrderDetail;
};

export function MyOrderPaymentCard({ order }: MyOrderPaymentCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <h2 className="text-xl font-black text-white">결제 정보</h2>
      <dl className="mt-5 grid gap-3 text-sm">
        <MyOrderDetailRow label="결제 수단" value={paymentMethodLabel[order.paymentMethod]} />
        <MyOrderDetailRow label="상품 금액" value={formatPrice(order.totalOrderAmount)} />
        <MyOrderDetailRow
          label="사용 포인트"
          value={`${order.pointUsed.toLocaleString("ko-KR")} P`}
        />
        <MyOrderDetailRow
          label="적립 포인트"
          value={`${order.pointEarned.toLocaleString("ko-KR")} P`}
          isHighlight
        />
        <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
          <dt className="font-black text-white">최종 결제 금액</dt>
          <dd className="font-black text-[#d6a84f]">{formatPrice(order.paymentAmount)}</dd>
        </div>
      </dl>
    </section>
  );
}

import { formatPrice } from "@/components/cart/cart.utils";
import type { MyOrderDetail } from "@/components/order/order.api";
import { MyOrderDetailRow } from "./MyOrderDetailRow";
import { paymentMethodLabel } from "./my-order.labels";

type MyOrderPaymentCardProps = {
  order: MyOrderDetail;
};

export function MyOrderPaymentCard({ order }: MyOrderPaymentCardProps) {
  return (
    <section className="rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <h2 className="text-xl font-black text-[#071d3b]">결제 정보</h2>
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
        <div className="flex justify-between gap-4 border-t border-[#edf0f3] pt-3">
          <dt className="font-black text-[#071d3b]">최종 결제 금액</dt>
          <dd className="font-black text-[#ff4b1f]">{formatPrice(order.paymentAmount)}</dd>
        </div>
      </dl>
    </section>
  );
}

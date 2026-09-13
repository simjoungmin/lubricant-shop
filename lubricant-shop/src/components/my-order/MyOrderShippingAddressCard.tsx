import type { MyOrderDetail } from "@/components/order/order.api";
import { MyOrderDetailRow } from "./MyOrderDetailRow";

type MyOrderShippingAddressCardProps = {
  order: MyOrderDetail;
};

export function MyOrderShippingAddressCard({ order }: MyOrderShippingAddressCardProps) {
  return (
    <section className="rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <h2 className="text-xl font-black text-[#071d3b]">배송 정보</h2>
      <dl className="mt-5 grid gap-3 text-sm">
        <MyOrderDetailRow label="수령인" value={order.receiverName} />
        <MyOrderDetailRow label="연락처" value={order.receiverPhone} />
        <div className="grid gap-2">
          <dt className="font-bold text-[#65717f]">배송지</dt>
          <dd className="font-bold leading-6 text-[#071d3b]">{order.shippingAddress}</dd>
        </div>
        {order.deliveryRequest ? (
          <div className="grid gap-2">
            <dt className="font-bold text-[#65717f]">배송 요청</dt>
            <dd className="font-bold leading-6 text-[#34465c]">{order.deliveryRequest}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

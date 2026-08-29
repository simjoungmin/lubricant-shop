import type { MyOrderDetail } from "@/components/order/order.api";
import { MyOrderDetailRow } from "./MyOrderDetailRow";

type MyOrderShippingAddressCardProps = {
  order: MyOrderDetail;
};

export function MyOrderShippingAddressCard({ order }: MyOrderShippingAddressCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <h2 className="text-xl font-black text-white">배송 정보</h2>
      <dl className="mt-5 grid gap-3 text-sm">
        <MyOrderDetailRow label="수령인" value={order.receiverName} />
        <MyOrderDetailRow label="연락처" value={order.receiverPhone} />
        <div className="grid gap-2">
          <dt className="font-bold text-zinc-500">배송지</dt>
          <dd className="font-bold leading-6 text-white">{order.shippingAddress}</dd>
        </div>
        {order.deliveryRequest ? (
          <div className="grid gap-2">
            <dt className="font-bold text-zinc-500">배송 요청</dt>
            <dd className="font-bold leading-6 text-zinc-300">{order.deliveryRequest}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

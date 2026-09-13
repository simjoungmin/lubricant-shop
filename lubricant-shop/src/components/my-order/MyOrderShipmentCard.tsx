import type { MyOrderDetail } from "@/components/order/order.api";
import { MyOrderDetailRow } from "./MyOrderDetailRow";
import { formatDateTime } from "./my-order.utils";

type MyOrderShipmentCardProps = {
  order: MyOrderDetail;
};

export function MyOrderShipmentCard({ order }: MyOrderShipmentCardProps) {
  return (
    <section className="rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <h2 className="text-xl font-black text-[#071d3b]">배송 진행 정보</h2>
      <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
        <MyOrderDetailRow label="택배사" value={order.courier || "아직 등록 전"} />
        <MyOrderDetailRow label="송장번호" value={order.trackingNumber || "아직 등록 전"} />
        <MyOrderDetailRow
          label="배송 시작일"
          value={order.shippedAt ? formatDateTime(order.shippedAt) : "아직 배송중 처리 전"}
        />
        <MyOrderDetailRow
          label="배송 완료일"
          value={order.deliveredAt ? formatDateTime(order.deliveredAt) : "아직 배송완료 전"}
        />
      </dl>
    </section>
  );
}

import { formatPrice } from "@/components/cart/cart.utils";
import { BankTransferGuide } from "@/components/order/BankTransferGuide";
import type { OrderCreateResponse } from "@/components/order/order.api";
import Link from "next/link";

type OrderCompleteSectionProps = {
  createdOrder: OrderCreateResponse;
  message: string;
};

export function OrderCompleteSection({
  createdOrder,
  message,
}: OrderCompleteSectionProps) {
  const shouldShowBankTransferGuide =
    createdOrder.paymentMethod === "BANK_TRANSFER" && createdOrder.orderStatus === "ORDERED";

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-white/10 bg-[#171611] p-6">
        <p className="text-sm font-black text-[#d6a84f]">주문 저장 완료</p>
        <h2 className="mt-3 text-2xl font-black text-white">{createdOrder.orderNumber}</h2>
        <div className="mt-6 grid gap-3 text-sm">
          <SummaryRow label="주문 상태" value={createdOrder.orderStatus} />
          <SummaryRow label="상품 합계" value={formatPrice(createdOrder.totalOrderAmount)} />
          <SummaryRow label="사용 포인트" value={`${createdOrder.pointUsed.toLocaleString("ko-KR")} P`} />
          <div className="flex justify-between border-t border-white/10 pt-3 text-zinc-300">
            <span className="font-black">결제 금액</span>
            <strong className="text-xl font-black text-[#d6a84f]">
              {formatPrice(createdOrder.paymentAmount)}
            </strong>
          </div>
        </div>

        {message ? (
          <p className="mt-5 rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-zinc-200">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/my-page/orders/${createdOrder.orderId}`}
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#d6a84f]/70 px-5 text-sm font-black text-[#d6a84f] transition hover:bg-[#d6a84f] hover:text-black"
          >
            주문 상세 보기
          </Link>
          <Link
            href="/my-page/orders"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
          >
            주문 내역으로 이동
          </Link>
        </div>
      </div>

      <aside className="grid h-fit gap-5">
        {shouldShowBankTransferGuide ? (
          <BankTransferGuide
            orderNumber={createdOrder.orderNumber}
            paymentAmount={createdOrder.paymentAmount}
          />
        ) : null}
        <section className="rounded-lg border border-white/10 bg-[#171611] p-5">
          <h3 className="text-lg font-black text-white">다음 단계</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>입금 확인 전 주문은 주문접수 상태로 유지됩니다.</p>
            <p>결제 완료 후 상품 준비, 배송중, 배송 완료 순서로 처리됩니다.</p>
          </div>
        </section>
      </aside>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-zinc-400">
      <span>{label}</span>
      <strong className="text-white">{value}</strong>
    </div>
  );
}

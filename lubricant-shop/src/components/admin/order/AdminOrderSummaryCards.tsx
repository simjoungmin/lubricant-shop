import { formatPrice } from "@/components/cart/cart.utils";

type AdminOrderSummaryCardsProps = {
  totalCount: number;
  orderedCount: number;
  preparingCount: number;
  salesAmount: number;
};

export function AdminOrderSummaryCards({
  totalCount,
  orderedCount,
  preparingCount,
  salesAmount,
}: AdminOrderSummaryCardsProps) {
  return (
    <section className="mb-5 grid gap-3 md:grid-cols-4">
      <SummaryCard label="전체 주문" value={`${totalCount}건`} />
      <SummaryCard label="접수/결제" value={`${orderedCount}건`} valueClassName="text-[#d6a84f]" />
      <SummaryCard label="출고 대기" value={`${preparingCount}건`} />
      <SummaryCard label="결제 합계" value={formatPrice(salesAmount)} />
    </section>
  );
}

function SummaryCard({
  label,
  value,
  valueClassName = "text-white",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-black ${valueClassName}`}>{value}</p>
    </div>
  );
}

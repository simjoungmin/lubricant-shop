type AdminProductSummaryCardsProps = {
  productCount: number;
  totalStock: number;
  lowStockCount: number;
  soldOutCount: number;
};

export function AdminProductSummaryCards({
  productCount,
  totalStock,
  lowStockCount,
  soldOutCount,
}: AdminProductSummaryCardsProps) {
  return (
    <section className="mb-5 grid gap-3 md:grid-cols-4">
      <SummaryCard label="등록 상품" value={`${productCount}개`} />
      <SummaryCard label="전체 재고" value={`${totalStock.toLocaleString("ko-KR")}개`} />
      <SummaryCard label="재고 주의" value={`${lowStockCount}개`} valueClassName="text-[#d6a84f]" />
      <SummaryCard label="품절/품절예정" value={`${soldOutCount}개`} valueClassName="text-red-400" />
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

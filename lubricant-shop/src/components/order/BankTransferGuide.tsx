import { formatPrice } from "@/components/cart/cart.utils";

type BankTransferGuideProps = {
  orderNumber: string;
  paymentAmount: number;
};

export function BankTransferGuide({ orderNumber, paymentAmount }: BankTransferGuideProps) {
  return (
    <section className="rounded-lg border border-[#d6a84f]/40 bg-[#d6a84f]/10 p-5">
      <p className="text-sm font-black text-[#d6a84f]">무통장입금 안내</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <GuideRow label="입금 계좌" value="국민은행 123456-01-123456" />
        <GuideRow label="예금주" value="오일마스터" />
        <GuideRow label="입금 금액" value={formatPrice(paymentAmount)} isHighlight />
        <GuideRow label="주문번호" value={orderNumber} />
      </dl>
      <p className="mt-4 text-xs font-bold leading-5 text-zinc-400">
        입금 확인 후 관리자가 결제 완료로 처리합니다.
      </p>
    </section>
  );
}

function GuideRow({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-bold text-zinc-500">{label}</dt>
      <dd className={`text-right font-black ${isHighlight ? "text-[#d6a84f]" : "text-white"}`}>
        {value}
      </dd>
    </div>
  );
}

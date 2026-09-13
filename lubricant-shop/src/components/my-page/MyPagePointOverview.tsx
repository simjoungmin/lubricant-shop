import type { AuthUser } from "@/components/auth/auth/auth.types";
import Link from "next/link";

type MyPagePointOverviewProps = {
  pointBalance: AuthUser["pointBalance"];
};

export function MyPagePointOverview({ pointBalance }: MyPagePointOverviewProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dde2e8] bg-[#071d3b] text-white shadow-[0_16px_32px_rgba(7,29,59,0.12)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black text-[#aeb9c8]">보유 포인트</p>
          <p className="mt-3 text-4xl font-black tracking-normal">
            {pointBalance.toLocaleString("ko-KR")} P
          </p>
          <p className="mt-3 text-sm font-bold leading-6 text-[#d7dee8]">
            결제 단계에서 사용 가능한 포인트입니다.
          </p>
        </div>
        <Link
          href="/order"
          className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-black text-[#071d3b] transition hover:bg-[#f0f3f7]"
        >
          주문하러 가기
        </Link>
      </div>
    </section>
  );
}

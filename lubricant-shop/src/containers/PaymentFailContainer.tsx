"use client";

import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";

type PaymentFailContainerProps = {
  code?: string;
  message?: string;
  orderId?: string;
};

export default function PaymentFailContainer({
  code,
  message,
  orderId,
}: PaymentFailContainerProps) {
  return (
    <>
      <OilHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:py-16">
        <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
          <p className="text-sm font-black text-[#ff4b1f]">결제 실패</p>
          <h1 className="mt-3 text-2xl font-black text-[#071d3b]">결제가 완료되지 않았습니다.</h1>
          <div className="mt-5 grid gap-3 text-sm font-bold text-[#65717f]">
            <p>{message || "결제창에서 결제가 취소되었거나 승인되지 않았습니다."}</p>
            {code ? <p>오류 코드: {code}</p> : null}
            {orderId ? <p>주문번호: {orderId}</p> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/order"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
            >
              다시 결제하기
            </Link>
            <Link
              href="/my-page/orders"
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#aab3bf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
            >
              주문 내역 확인
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

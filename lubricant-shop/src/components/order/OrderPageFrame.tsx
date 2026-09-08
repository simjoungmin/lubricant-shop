import type { ReactNode } from "react";

type OrderPageFrameProps = {
  children: ReactNode;
};

export function OrderPageFrame({ children }: OrderPageFrameProps) {
  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-6 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black text-[#ff4b1f]">ORDER</p>
        <h1 className="mt-3 text-3xl font-black text-[#071d3b]">주문서 작성</h1>
        <p className="mt-3 text-sm leading-6 text-[#65717f]">
          주문 정보를 확인하고 주문을 접수합니다.
        </p>
      </div>

      {children}
    </main>
  );
}

export function OrderLoadingSection() {
  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white px-6 py-16 text-center text-sm font-bold text-[#65717f]">
      주문 정보를 불러오는 중입니다.
    </section>
  );
}

import InquiryFlow from "@/components/customer/InquiryFlow";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";
import React from "react";

export default function InquiryContainer() {
  return (
    <>
      <OilHeader />

      <main className="bg-[#f7f7f5]">
        <section className="border-b border-[#e2e6eb] bg-white">
          <div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-8">
            <Link
              href="/customer-center"
              className="text-sm font-bold text-[#65717f] transition hover:text-[#ff4b1f]"
            >
              고객센터로 돌아가기
            </Link>
            <p className="mt-8 text-sm font-black uppercase text-[#ff4b1f]">1:1 Inquiry</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#071d3b] md:text-5xl">
              문의 유형을 선택하고 필요한 정보를 남겨주세요.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#65717f]">
              배송, 상품, 주문, 교환/반품, B2B 제휴까지 세부 항목을 먼저 선택하면
              문의에 필요한 입력칸이 이어서 열립니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-8">
          <InquiryFlow />
        </section>
      </main>

    </>
  );
}

import Link from "next/link";
import React from "react";

const partnerBrands = ["Mobil", "Shell", "Castrol", "ZIC", "Kixx", "Total"];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-[#e7eaee] bg-[linear-gradient(90deg,#ffffff_0%,#fbfaf8_52%,#f0efec_100%)]">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_80%_58%,rgba(7,29,59,0.16),transparent_35%)] lg:block" />

      <div className="mx-auto grid min-h-[488px] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-[1fr_0.95fr] lg:px-8">
        <div className="relative z-10">
          <p className="mb-5 text-xs font-black uppercase text-[#ff4b1f]">
            Engine Oil Specialist
          </p>

          <h1 className="mb-7 text-4xl font-black leading-tight text-[#071d3b] md:text-6xl">
            차에 맞는 오일을,
            <br />
            복잡하지 않게.
          </h1>

          <p className="mb-8 max-w-[520px] text-base leading-8 text-[#596675]">
            오일마스터는 100% 정품 엔진오일만 취급합니다.
            <br />
            전문가가 직접 검수한 믿을 수 있는 제품을 만나보세요.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/category"
              className="inline-flex min-w-36 items-center justify-center rounded bg-[#ff4b1f] px-7 py-3 text-sm font-black text-white shadow-[0_10px_22px_rgba(255,75,31,0.24)] transition hover:bg-[#e63e16]"
            >
              내 차 오일 찾기
            </Link>
            <Link
              href="/category"
              className="inline-flex min-w-40 items-center justify-center rounded border border-[#aab3bf] bg-white px-7 py-3 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
            >
              전체 상품 보기
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5 text-[11px] font-black text-[#071d3b]/80">
            <span className="font-medium text-[#87909c]">공식 공급 브랜드</span>
            {partnerBrands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[390px] items-end justify-center md:flex">
          <div className="absolute right-6 top-10 flex h-28 w-28 items-center justify-center rounded-full border border-[#f1b77f] bg-white/70 text-center text-[#ff6a21]">
            <div>
              <p className="text-[10px] font-black uppercase">Premium</p>
              <p className="text-2xl font-black">5W-30</p>
              <p className="text-[10px] font-bold">100% 정품</p>
            </div>
          </div>

          <div className="relative h-[360px] w-[260px] rounded-[36px] bg-[#111820] p-8 shadow-[0_28px_50px_rgba(7,29,59,0.28)]">
            <div className="absolute -right-20 bottom-0 h-44 w-44 rounded-full border-[18px] border-[#d7dce1]" />
            <div className="absolute -right-8 top-7 h-40 w-16 rounded-[32px] border-[18px] border-[#111820]" />
            <div className="mx-auto h-10 w-24 rounded-t-2xl bg-[#111820] shadow-inner" />
            <div className="mt-9 rounded-xl bg-white p-4 text-center shadow-inner">
              <p className="text-2xl font-black text-[#1470c8]">Mobil</p>
              <p className="mx-auto mt-2 flex h-20 w-16 items-center justify-center bg-[#0b0b0d] text-6xl font-black text-white">
                1
              </p>
              <p className="mt-3 rounded bg-[#51402f] py-2 text-xs font-bold text-white">
                5W-30
              </p>
            </div>
            <p className="absolute bottom-6 right-7 text-xl font-black text-white">4L</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

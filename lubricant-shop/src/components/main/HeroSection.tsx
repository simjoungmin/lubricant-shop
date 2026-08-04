import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_70%_30%,#4a3514_0%,#15130f_35%,#0d0d0b_100%)]">
      <div className="mx-auto grid min-h-[460px] max-w-[1440px] grid-cols-1 items-center px-8 md:grid-cols-2">
        <div className="relative z-10">
          <p className="mb-4 text-sm font-semibold text-[#d6a84f]">
            PREMIUM ENGINE OIL
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            엔진의 성능을 <br />
            <span className="text-[#d6a84f]">최대치로 끌어올리다</span>
          </h1>

          <p className="mb-8 max-w-[480px] text-base leading-7 text-zinc-400">
            최고의 오일로 완성되는 퍼포먼스. 차량에 맞는 엔진오일을
            쉽고 빠르게 찾아보세요.
          </p>

          <Link
            href="/category"
            className="inline-flex rounded-full bg-[#d6a84f] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#f0c76a]"
          >
            제품 보러가기
          </Link>
        </div>

        <div className="relative flex justify-center">
          <div className="h-[340px] w-[280px] rounded-[32px] border border-[#d6a84f]/40 bg-gradient-to-br from-[#24211b] to-[#0c0c0a] p-8 shadow-2xl shadow-black/60">
            <div className="mb-6 text-center text-[#d6a84f]">OIL MASTER</div>
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30">
              <p className="text-5xl font-black text-[#d6a84f]">5W-30</p>
              <p className="mt-3 text-zinc-400">PREMIUM OIL</p>
              <p className="mt-10 text-xl font-bold">4L</p>
            </div>
          </div>

          <div className="absolute bottom-8 h-20 w-[420px] rounded-full bg-[#d6a84f]/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

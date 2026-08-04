import { brandPillars, companyBrand, partnerHighlights } from "@/assets/brands";
import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";
import React from "react";

const BrandContainer = () => {
  return (
    <>
      <OilHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-[#0d0d0b]">
          <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-[#d6a84f] lg:block" />
          <div className="mx-auto grid min-h-[560px] max-w-[1440px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="relative z-10 max-w-3xl">
              <p className="text-sm font-black text-[#d6a84f]">{companyBrand.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                {companyBrand.name}
              </h1>
              <p className="mt-6 max-w-2xl text-2xl font-bold leading-snug text-zinc-100 md:text-3xl">
                {companyBrand.headline}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
                {companyBrand.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/category"
                  className="rounded-md bg-[#d6a84f] px-5 py-3 text-sm font-black text-black transition hover:bg-[#efc769]"
                >
                  상품 보러가기
                </Link>
                <a
                  href="#partner"
                  className="rounded-md border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
                >
                  파트너십 보기
                </a>
              </div>
            </div>

            <div className="relative z-10 lg:pl-8">
              <div className="border border-black/10 bg-[#11100d] p-6 shadow-2xl shadow-black/40 lg:bg-black/85">
                <div className="flex h-[320px] flex-col justify-between rounded-md border border-white/10 bg-[#171611] p-7">
                  <div>
                    <p className="text-xs font-black text-[#d6a84f]">SELECTED IMPORT</p>
                    <h2 className="mt-4 text-5xl font-black text-white">OM</h2>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">High-grade fuel, refined oil.</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      해외 프리미엄 제품을 국내 주행 환경에 맞춰 큐레이션합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#11100d] py-16">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-black text-[#d6a84f]">OUR STANDARD</p>
              <h2 className="mt-3 text-3xl font-black text-white">좋은 것만 선별하는 기준</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {brandPillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-lg border border-white/10 bg-[#171611] p-5"
                >
                  <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0d0d0b] py-16">
          <div className="mx-auto max-w-[980px] px-6 text-center lg:px-8">
            <p className="text-sm font-black text-[#d6a84f]">REFINED PERFORMANCE</p>
            <blockquote className="mt-5 text-3xl font-black leading-snug text-white md:text-5xl">
              {companyBrand.refinedCopy}
            </blockquote>
          </div>
        </section>

        <section id="partner" className="bg-[#11100d] py-16">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div>
              <p className="text-sm font-black text-[#d6a84f]">KOREA PARTNERSHIP</p>
              <h2 className="mt-3 text-3xl font-black text-white">
                국내 기업과 함께 완성하는 안정적인 공급
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-400">
                {companyBrand.partnerCopy}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {partnerHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-[#171611] p-5"
                >
                  <p className="text-xs font-black text-zinc-500">{item.label}</p>
                  <p className="mt-3 text-xl font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <OilFooter />
    </>
  );
};

export default BrandContainer;

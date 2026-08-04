import { brandPillars, companyBrand } from "@/assets/brands";
import Link from "next/link";
import React from "react";

const BrandSection = () => {
  return (
    <section className="bg-[#11100d] py-12">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="rounded-lg border border-white/10 bg-[#171511] p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#d6a84f]">BRAND STORY</p>
              <h2 className="mt-2 text-2xl font-bold">{companyBrand.name}</h2>
            </div>
            <Link
              href="/brand"
              className="text-sm font-bold text-[#d6a84f] transition hover:text-white"
            >
              브랜드 소개보기
            </Link>
          </div>

          <p className="max-w-3xl text-base leading-7 text-zinc-300">
            {companyBrand.description}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {brandPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-md border border-white/10 bg-black/20 p-5"
              >
                <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;

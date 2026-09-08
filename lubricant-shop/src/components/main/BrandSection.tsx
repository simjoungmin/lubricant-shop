import Link from "next/link";
import React from "react";

const brandValues = [
  ["전문가 검수", "모든 제품을 전문가가 직접 검수합니다."],
  ["정확한 정보", "신뢰할 수 있는 정보를 제공합니다."],
  ["고객 우선", "고객 만족을 최우선으로 생각합니다."],
];

const BrandSection = () => {
  return (
    <section className="bg-[#f7f7f5] py-12">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 md:grid-cols-[1fr_1.35fr_0.9fr] lg:px-8">
        <div className="min-h-48 rounded bg-[#1a242f] p-8 text-white">
          <p className="text-3xl font-black">OIL MASTER</p>
          <div className="mt-16 h-1 w-24 bg-[#ff4b1f]" />
        </div>

        <div>
          <p className="text-xs font-black uppercase text-[#ff4b1f]">About Oil Master</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">
            좋은 오일이 좋은 엔진을 만듭니다.
          </h2>
          <p className="mt-5 leading-8 text-[#65717f]">
            오일마스터는 검증된 정품 엔진오일과 정확한 정보로 고객님의 건강한
            드라이빙을 응원합니다.
          </p>
          <Link href="/brand" className="mt-5 inline-flex font-black hover:text-[#ff4b1f]">
            OIL MASTER →
          </Link>
        </div>

        <div className="space-y-5">
          {brandValues.map(([title, description]) => (
            <div key={title}>
              <p className="font-black">{title}</p>
              <p className="mt-1 text-sm leading-6 text-[#65717f]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;

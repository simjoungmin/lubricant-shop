import Link from "next/link";
import React from "react";

const categories = [
  { label: "엔진 오일", href: "/category/engine/5w-30" },
  { label: "미션 오일", href: "/category/mission/atf" },
  { label: "브레이크 오일", href: "/category/brake/dot-4" },
  { label: "냉각수", href: "/category/chemical/coolant" },
  { label: "필터", href: "/category/filter/oil-filter" },
  { label: "케미컬", href: "/category/chemical/additive" },
];

const services = [
  { label: "정품 보장" },
  { label: "빠른 배송" },
  { label: "전문 상담", href: "/customer-center" },
  { label: "안전 거래" },
];

const categoryCardClassName =
  "group block rounded-2xl border border-white/10 bg-[#201d17] p-6 text-left transition hover:border-[#d6a84f]/70 hover:bg-[#2b261d]";

const serviceCardClassName =
  "block rounded-2xl border border-white/10 bg-[#11100d] px-5 py-4";

const CategorySection = () => {
  return (
    <section className="bg-[#171511] py-12">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="mb-8">
          <p className="text-xs font-bold text-[#d6a84f]">CATEGORY</p>
          <h2 className="mt-2 text-2xl font-bold">카테고리 쇼핑</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {categories.map((category) => {
            const cardContent = (
              <>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-2xl text-[#d6a84f]">
                ⛽
              </div>
              <p className="font-semibold">{category.label}</p>
              <p className="mt-1 text-xs text-zinc-500">바로가기</p>
              </>
            );

            return category.href ? (
              <Link
                key={category.label}
                href={category.href}
                className={categoryCardClassName}
              >
                {cardContent}
              </Link>
            ) : (
              <button
                key={category.label}
                type="button"
                className={categoryCardClassName}
              >
                {cardContent}
              </button>
            );
          })}
        </div>

        {/* <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {services.map((service) => (
            service.href ? (
              <Link
                key={service.label}
                href={service.href}
                className={`${serviceCardClassName} transition hover:border-[#d6a84f]/70`}
              >
                <p className="font-semibold text-[#d6a84f]">{service.label}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  OIL MASTER 공식 서비스
                </p>
              </Link>
            ) : (
              <div key={service.label} className={serviceCardClassName}>
                <p className="font-semibold text-[#d6a84f]">{service.label}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  OIL MASTER 공식 서비스
                </p>
              </div>
            )
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default CategorySection;

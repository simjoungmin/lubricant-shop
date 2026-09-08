import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import React from "react";

const warehouseImageUrl =
  "https://bridgeindustrial.com/wp-content/uploads/2025/09/Bridge-Portfolio-BP-Elk-Grove-II-01-1024x576.jpg";
const workshopImageUrl =
  "https://wics.com.au/cdn/shop/files/Workshop_Cleaning_Supplies.jpg?crop=center&height=5760&v=1768176703&width=4000";

const companyStats = [
  { value: "10+", label: "년 이상 노하우" },
  { value: "100+", label: "취급 브랜드" },
  { value: "20,000+", label: "누적 고객 수" },
  { value: "98%", label: "고객 만족도" },
];

const processItems = [
  {
    number: "01",
    title: "제품 선별",
    description: "공식 유통 제품과 검증된 규격을 기준으로 품목을 선별합니다.",
  },
  {
    number: "02",
    title: "재고 관리",
    description: "주요 오일과 소모품을 빠르게 출고할 수 있도록 관리합니다.",
  },
  {
    number: "03",
    title: "배송 대응",
    description: "주문 이후 문의와 배송 상황까지 고객센터에서 확인합니다.",
  },
];

const serviceItems = [
  "정품 오일과 필터를 기준으로 상품을 운영합니다.",
  "차량별 점도와 규격을 확인해 구매 판단을 돕습니다.",
  "장기적인 반복 구매가 가능하도록 재고를 관리합니다.",
  "배송 상태와 상품 문의를 고객센터에서 함께 확인합니다.",
];

const partnerBrands = ["Mobil", "Shell", "Castrol", "ZIC", "MANN FILTER", "BOSCH"];

const BrandContainer = () => {
  return (
    <>
      <OilHeader />

      <main className="bg-white text-[#071d3b]">
        <section className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff4b1f]">
                About OIL MASTER
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                안전한 주행을 위한
                <br />
                믿을 수 있는 선택
              </h1>
              <p className="mt-6 max-w-[520px] text-sm font-semibold leading-7 text-[#596675]">
                오일마스터는 자동차 관리에 필요한 정품 오일과 소모품을 선별해
                정확한 제품과 안정적인 구매 경험을 제공합니다.
              </p>
            </div>

            <div
              className="relative min-h-[340px] overflow-hidden bg-[#eef1f4] bg-cover bg-center"
              style={{ backgroundImage: `url(${warehouseImageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
              <div className="absolute left-8 top-8 text-xl font-black tracking-tight text-white">
                <span className="text-[#ff4b1f]">OIL</span> MASTER
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e5e8ed] bg-[#fbfcfd]">
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-x divide-y divide-[#e5e8ed] px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
            {companyStats.map((stat) => (
              <div key={stat.label} className="px-5 py-7 text-center">
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="mt-2 text-xs font-bold text-[#7a8490]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff4b1f]">
            Our Process
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight">
            검증된 프로세스로
            <br />
            최고의 제품을 제공합니다.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {processItems.map((item, index) => (
              <article key={item.number} className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#ff4b1f] text-[#ff4b1f]">
                  <span className="text-sm font-black">{item.number}</span>
                </div>
                {index < processItems.length - 1 ? (
                  <div className="absolute left-20 top-8 hidden h-px w-[calc(100%-5rem)] bg-[#ffd3c5] md:block" />
                ) : null}
                <h3 className="mt-6 text-lg font-black">{item.title}</h3>
                <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#65717f]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f7f5]">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.95fr] lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff4b1f]">
                Our Service
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight">
                단순한 판매를 넘어,
                <br />
                차량 관리의 동반자가 되겠습니다.
              </h2>
              <ul className="mt-8 grid gap-4">
                {serviceItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-[#34465c]">
                    <span className="mt-1 text-[#ff4b1f]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="min-h-[340px] bg-[#e9edf2] bg-cover bg-center"
              style={{ backgroundImage: `url(${workshopImageUrl})` }}
              aria-label="정비사가 차량 엔진룸을 점검하는 사진"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-14 text-center lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff4b1f]">
            Our Partners
          </p>
          <h2 className="mt-4 text-2xl font-black">함께하는 브랜드</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 text-sm font-black text-[#7a8490] sm:grid-cols-3 md:grid-cols-6">
            {partnerBrands.map((brand) => (
              <div key={brand} className="flex h-12 items-center justify-center">
                {brand}
              </div>
            ))}
          </div>
        </section>
      </main>

      <OilFooter />
    </>
  );
};

export default BrandContainer;

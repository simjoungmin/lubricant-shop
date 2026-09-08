import React from "react";

const serviceItems = [
  ["100% 정품 보증", "정품 엔진오일만 취급하여 안심하고 사용하세요."],
  ["차량 맞춤 상담", "전문가가 내 차와 맞는 오일을 꼼꼼하게 추천해 드립니다."],
  ["빠른 출고", "평일 오후 2시 이전 주문 시 당일 출고합니다."],
  ["안전한 포장", "파손 위험을 줄인 전용 포장으로 배송합니다."],
];

const ServiceBannerSection = () => {
  return (
    <section className="bg-[#f7f7f5] py-8">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="grid border border-[#d8dde3] bg-white md:grid-cols-4">
          {serviceItems.map(([title, description]) => (
            <div
              key={title}
              className="border-b border-[#e4e8ed] p-6 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="text-base font-black">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[#65717f]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBannerSection;

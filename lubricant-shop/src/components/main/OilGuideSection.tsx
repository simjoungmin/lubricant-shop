import Link from "next/link";
import React from "react";

const OilGuideSection = () => {
  return (
    <section className="bg-[#11100d] py-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#282724,#15130f)] p-8">
          <p className="text-sm font-bold text-[#d6a84f]">
            내 차에 맞는 오일 찾기
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            차량 정보만 입력하면 <br />
            적합한 오일을 추천해드려요
          </h2>
          <p className="mt-4 text-sm text-zinc-400">
            차종, 연식, 엔진 타입에 맞는 엔진오일을 쉽게 확인하세요.
          </p>
          <Link
            href="/category"
            className="mt-8 inline-flex rounded-full bg-[#d6a84f] px-5 py-3 text-sm font-bold text-black"
          >
            오일 선택 가이드 →
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#1b1813] p-8">
          <p className="text-sm font-bold text-[#d6a84f]">오일 선택 가이드</p>
          <h2 className="mt-3 text-3xl font-bold">
            점도, 규격, 브랜드까지 <br />
            한 번에 비교하세요
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {["가솔린", "디젤", "하이브리드", "수입차"].map((item) => (
              <Link
                key={item}
                href="/category"
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-xs text-zinc-500">추천 오일 보기</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OilGuideSection;

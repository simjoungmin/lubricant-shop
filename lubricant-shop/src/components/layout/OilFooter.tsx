import React from "react";

const OilFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0d0d0b] py-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-8 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-bold text-[#d6a84f]">OIL MASTER</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            프리미엄 자동차 엔진오일과 케미컬 제품을 전문적으로 판매하는
            오일 전문 쇼핑몰입니다.
          </p>
        </div>

        <div>
          <h3 className="font-bold">고객센터</h3>
          <p className="mt-4 text-2xl font-black text-[#d6a84f]">
            02-1234-5678
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            평일 09:00 - 18:00
          </p>
        </div>

        <div>
          <h3 className="font-bold">은행 정보</h3>
          <p className="mt-4 text-sm text-zinc-500">
            국민은행 123-456-789012
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            예금주: 오일마스터
          </p>
        </div>

        <div>
          <h3 className="font-bold">회사 정보</h3>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            상호명: OIL MASTER <br />
            대표자: 홍길동 <br />
            사업자등록번호: 123-45-67890
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1440px] px-8 text-xs text-zinc-600">
        © 2026 OIL MASTER. All rights reserved.
      </div>
    </footer>
  );
};

export default OilFooter;
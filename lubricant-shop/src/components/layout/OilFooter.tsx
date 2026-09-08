import React from "react";

const OilFooter = () => {
  return (
    <footer className="border-t border-[#e2e6eb] bg-white">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-8 md:grid-cols-[1fr_2fr_1.2fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-black text-[#071d3b]">OIL MASTER</h2>
          <p className="mt-5 text-sm font-bold text-[#071d3b]">고객센터 02-1234-5678</p>
          <p className="mt-2 text-sm text-[#65717f]">운영시간 평일 09:00 - 18:00</p>
        </div>

        <div>
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-semibold text-[#65717f]">
            <span>회사소개</span>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
            <span>제휴/도매 문의</span>
          </div>
          <p className="mt-6 text-sm leading-7 text-[#65717f]">
            (주)오일마스터 | 대표: 김오일 | 사업자등록번호 123-45-67890
            <br />
            서울특별시 강남구 테헤란로 123, 10층
          </p>
        </div>

        <div className="grid gap-4 text-sm text-[#65717f]">
          <div>
            <p className="font-black text-[#071d3b]">SSL 보안 인증</p>
            <p className="mt-1">사이트 전반 SSL</p>
          </div>
          <div>
            <p className="font-black text-[#071d3b]">현금영수증 발행</p>
            <p className="mt-1">모든 구매 고객 발행 가능</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OilFooter;

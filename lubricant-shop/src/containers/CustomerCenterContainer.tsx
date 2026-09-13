import { faqItems } from "@/assets/customer-center";
import { inquiryCategories } from "@/assets/inquiry-categories";
import { DeliveryLookupLink } from "@/components/customer/DeliveryLookupLink";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";
import React from "react";

const noticeItems = [
  { title: "5월 고객센터 운영시간 변경 안내", date: "05.01" },
  { title: "오일 상품 안전 포장 기준 안내", date: "04.30" },
  { title: "포인트 정책 변경 안내", date: "04.25" },
  { title: "정비소 납품 문의 접수 안내", date: "04.20" },
];

const contactItems = [
  {
    title: "전화 상담",
    value: "1544-0000",
    description: "평일 09:00 - 18:00",
  },
  {
    title: "카카오톡 상담",
    value: "오일마스터 검색",
    description: "상담 가능 시간 내 순차 답변",
  },
  {
    title: "이메일 문의",
    value: "help@oilmaster.co.kr",
    description: "24시간 접수 가능",
  },
];

const CustomerCenterContainer = () => {
  return (
    <>
      <OilHeader />

      <main className="bg-[#f7f7f5] text-[#071d3b]">
        <section className="border-b border-[#e2e6eb] bg-white">
          <div className="mx-auto max-w-[1240px] px-6 py-14 lg:px-8">
            <div>
              <p className="text-sm font-black uppercase text-[#ff4b1f]">Customer Center</p>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                궁금한 내용을 빠르게
                <br />
                확인하고 문의하세요.
              </h1>
              <p className="mt-5 max-w-[560px] text-sm font-semibold leading-7 text-[#65717f]">
                주문, 배송, 상품, 교환/반품까지 자주 필요한 안내를 한곳에 모았습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 py-10 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="border border-[#ffd3c5] bg-[#fff3ef] p-7">
              <p className="text-sm font-black text-[#ff4b1f]">문의하기</p>
              <h2 className="mt-3 text-2xl font-black">상담이 필요하신가요?</h2>
              <p className="mt-3 text-sm leading-6 text-[#65717f]">
                문의 유형을 선택하고 필요한 정보를 남겨주시면 담당자가 확인합니다.
              </p>
              <Link
                href="/customer-center/inquiry"
                className="mt-7 flex h-12 items-center justify-between bg-[#ff4b1f] px-5 text-sm font-black text-white transition hover:bg-[#e63e16]"
              >
                1:1 문의하기
                <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="border border-[#dde2e8] bg-white p-7">
              <p className="text-sm font-black text-[#ff4b1f]">배송 조회</p>
              <h2 className="mt-3 text-2xl font-black text-[#071d3b]">주문하신 상품의 상태를 확인해 보세요.</h2>
              <p className="mt-3 text-sm leading-6 text-[#65717f]">
                로그인 후 마이페이지에서 주문 상태와 배송 정보를 확인할 수 있습니다.
              </p>
              <DeliveryLookupLink />
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 pb-10 lg:px-8">
          <div className="mb-5">
            <div>
              <p className="text-sm font-black uppercase text-[#ff4b1f]">Inquiry Shortcut</p>
              <h2 className="mt-2 text-2xl font-black">문의 유형 바로가기</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {inquiryCategories.map((category) => (
              <Link
                key={category.id}
                href={`/customer-center/inquiry?category=${category.id}`}
                className="group border border-[#dde2e8] bg-white p-5 transition hover:border-[#ff4b1f] hover:bg-[#fffaf7]"
              >
                <p className="text-base font-black group-hover:text-[#ff4b1f]">{category.label}</p>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[#7a8490]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-6 px-6 pb-12 md:grid-cols-2 lg:px-8">
          <div className="border border-[#dde2e8] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black">공지사항</h2>
              <Link href="/customer-center" className="text-xs font-bold text-[#7a8490]">
                더보기
              </Link>
            </div>
            <div className="divide-y divide-[#edf0f3]">
              {noticeItems.map((notice) => (
                <div key={notice.title} className="flex justify-between gap-4 py-3 text-sm">
                  <p className="font-semibold text-[#34465c]">{notice.title}</p>
                  <time className="shrink-0 text-xs font-bold text-[#7a8490]">{notice.date}</time>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#dde2e8] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black">자주 묻는 질문</h2>
              <Link href="/customer-center" className="text-xs font-bold text-[#7a8490]">
                더보기
              </Link>
            </div>
            <div className="divide-y divide-[#edf0f3]">
              {faqItems.map((faq) => (
                <details key={faq.question} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#34465c]">
                    {faq.question}
                    <span className="text-[#ff4b1f] group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#65717f]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e2e6eb] bg-white">
          <div className="mx-auto grid max-w-[1240px] gap-6 px-6 py-10 md:grid-cols-3 lg:px-8">
            {contactItems.map((item) => (
              <article key={item.title} className="text-center">
                <p className="text-sm font-black text-[#ff4b1f]">{item.title}</p>
                <p className="mt-3 text-lg font-black">{item.value}</p>
                <p className="mt-2 text-xs font-semibold text-[#7a8490]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

    </>
  );
};

export default CustomerCenterContainer;

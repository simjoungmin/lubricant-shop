import { faqItems, supportCards } from "@/assets/customer-center";
import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";
import React from "react";

const CustomerCenterContainer = () => {
  return (
    <>
      <OilHeader />

      <main>
        <section className="border-b border-white/10 bg-[#0d0d0b]">
          <div className="mx-auto grid min-h-[440px] max-w-[1440px] items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_420px] lg:px-8">
            <div>
              <p className="text-sm font-black text-[#d6a84f]">CUSTOMER CENTER</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                배송부터 상품 선택까지, 필요한 답을 빠르게 찾으세요.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
                OIL MASTER 고객센터는 프리미엄 수입 오일, 고급 휘발유 관련 제품,
                정비소 납품 문의까지 한 번에 안내합니다. 주문 전 확인부터 배송 후
                처리까지 세부 기준을 정리했습니다.
              </p>
            </div>

            <aside className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <p className="text-sm font-black text-[#d6a84f]">상담 운영</p>
              <p className="mt-4 text-4xl font-black text-white">02-1234-5678</p>
              <div className="mt-6 space-y-3 text-sm text-zinc-400">
                <p>평일 09:00 - 18:00</p>
                <p>점심 12:30 - 13:30</p>
                <p>주말 및 공휴일 휴무</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-[#11100d] py-14">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-sm font-black text-[#d6a84f]">SUPPORT GUIDE</p>
              <h2 className="mt-2 text-3xl font-black text-white">문의 유형별 안내</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {supportCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-[#171611] p-6"
                >
                  <h3 className="text-2xl font-black text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{card.summary}</p>
                  <ul className="mt-5 space-y-3">
                    {card.details.map((detail) => (
                      <li key={detail} className="flex gap-3 text-sm leading-6 text-zinc-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a84f]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-[#d6a84f]/30 bg-[#d6a84f]/10 p-6 md:flex md:items-center md:justify-between md:gap-6">
              <div>
                <h3 className="text-2xl font-black text-white">더 자세한 상담이 필요하신가요?</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  문의 유형을 선택하고 필요한 정보를 남겨주시면 담당자가 순서대로 확인합니다.
                </p>
              </div>
              <Link
                href="/customer-center/inquiry"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-md bg-[#d6a84f] px-6 text-sm font-black text-black transition hover:bg-[#efc769] md:mt-0"
              >
                문의하러 가기
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#11100d] py-14">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[360px_1fr] lg:px-8">
            <div>
              <p className="text-sm font-black text-[#d6a84f]">FAQ</p>
              <h2 className="mt-2 text-3xl font-black text-white">자주 듣는 질문</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                주문 전 자주 확인하는 내용을 모았습니다. 더 구체적인 상담이 필요하면
                차량 정보와 주문 정보를 함께 남겨주세요.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-lg border border-white/10 bg-[#171611] p-5"
                >
                  <h3 className="text-lg font-black text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <OilFooter />
    </>
  );
};

export default CustomerCenterContainer;

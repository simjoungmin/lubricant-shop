"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type MyPageLinkItem = {
  title: string;
  description: string;
  href: string;
  status?: string;
};

type MyPagePendingItem = {
  title: string;
  description: string;
  status: string;
};

const providerLabel = {
  email: "이메일 로그인",
  kakao: "카카오 로그인",
  naver: "네이버 로그인",
} as const;

const orderMenuItems: MyPageLinkItem[] = [
  {
    title: "주문 내역",
    description: "주문 번호, 결제 금액, 주문 상태를 확인합니다.",
    href: "/my-page/orders",
  },
  {
    title: "내 문의 확인",
    description: "내가 남긴 문의와 관리자 답변을 확인합니다.",
    href: "/my-page/inquiries",
  },
];

const pendingOrderMenuItems: MyPagePendingItem[] = [
  {
    title: "배송 현황",
    description: "주문 상세에서 상품 준비, 배송 중, 배송 완료 상태를 확인합니다.",
    status: "주문 상세에서 확인",
  },
];

const pendingAccountMenuItems: MyPagePendingItem[] = [
  {
    title: "이름 변경",
    description: "주문자와 문의 작성자 이름을 변경합니다.",
    status: "준비 중",
  },
  {
    title: "비밀번호 변경",
    description: "현재 비밀번호 확인 후 새 비밀번호로 변경합니다.",
    status: "준비 중",
  },
  {
    title: "계정 연동",
    description: "이메일, 카카오, 네이버 로그인을 연결합니다.",
    status: "준비 중",
  },
];

const menuLinkClassName =
  "group block rounded-lg border border-white/10 bg-[#171611] p-5 transition hover:border-[#d6a84f]";

const menuDisabledClassName =
  "rounded-lg border border-white/10 bg-[#171611] p-5 opacity-70";

const renderArrow = () => (
  <span
    aria-hidden="true"
    className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition group-hover:border-[#d6a84f] group-hover:text-[#d6a84f]"
  >
    →
  </span>
);

const MyPageContainer = () => {
  const router = useRouter();
  const { user, isReady, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <OilHeader />

      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[960px] px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold text-[#d6a84f]">MY PAGE</p>
          <h1 className="text-3xl font-black text-white">내 정보</h1>
        </div>

        {!isReady ? (
          <section className="rounded-lg border border-white/10 bg-[#171611] px-6 py-16 text-center text-sm font-bold text-zinc-300">
            내 정보를 불러오는 중입니다.
          </section>
        ) : user ? (
          <section className="grid gap-6">
            <div className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-400">환영합니다</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{user.name}</h2>
                  <p className="mt-2 text-sm font-bold text-zinc-400">{user.email}</p>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2 md:min-w-[360px]">
                  <div className="rounded-md border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-zinc-400">로그인 방식</p>
                    <p className="mt-2 font-black text-white">{providerLabel[user.provider]}</p>
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-zinc-400">보유 포인트</p>
                    <p className="mt-2 font-black text-[#d6a84f]">
                      {user.pointBalance.toLocaleString("ko-KR")} P
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
                >
                  쇼핑 계속하기
                </Link>
                <button
                  type="button"
                  className="h-11 rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-black text-white">주문·배송</h2>
                  <Link href="/cart" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
                    장바구니
                  </Link>
                </div>
                <div className="grid gap-3">
                  {orderMenuItems.map((item) => (
                    <Link key={item.title} href={item.href} className={menuLinkClassName}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-white">{item.title}</p>
                          <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">{item.description}</p>
                        </div>
                        {renderArrow()}
                      </div>
                    </Link>
                  ))}

                  {pendingOrderMenuItems.map((item) => (
                    <div key={item.title} className={menuDisabledClassName}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-white">{item.title}</p>
                          <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">{item.description}</p>
                        </div>
                        <span className="shrink-0 rounded-md border border-white/10 px-3 py-1 text-xs font-black text-zinc-400">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-black text-white">계정 관리</h2>
                <div className="grid gap-3">
                  {pendingAccountMenuItems.map((item) => (
                    <div key={item.title} className={menuDisabledClassName}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-white">{item.title}</p>
                          <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">{item.description}</p>
                        </div>
                        <span className="shrink-0 rounded-md border border-white/10 px-3 py-1 text-xs font-black text-zinc-400">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
            <p className="text-sm font-bold text-zinc-300">로그인 후 내 정보를 확인할 수 있습니다.</p>
            <Link
              href="/login"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
            >
              로그인하러 가기
            </Link>
          </section>
        )}
      </main>
    </>
  );
};

export default MyPageContainer;

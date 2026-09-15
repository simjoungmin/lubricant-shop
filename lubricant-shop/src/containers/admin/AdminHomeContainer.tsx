"use client";

import { AdminGuardMessage } from "@/components/admin/AdminGuardMessage";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/products",
    title: "재고 관리",
    description: "상품별 재고, 판매상태, 적립률을 확인하고 재고를 조정합니다.",
  },
  {
    href: "/admin/orders",
    title: "주문 관리",
    description: "주문 접수부터 배송완료까지 상태를 처리합니다.",
  },
  {
    href: "/admin/inquiries",
    title: "문의 관리",
    description: "고객 1:1 문의를 확인하고 답변합니다.",
  },
];

export default function AdminHomeContainer() {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 운영 메뉴를 사용할 수 있습니다."
      : "";

  return (
    <>
      <OilHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#11100d]">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-12 lg:px-8">
        <p className="text-sm font-black text-[#d6a84f]">ADMIN</p>
        <h1 className="mt-3 text-3xl font-black text-white">운영 관리</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          상품, 재고, 주문, 고객 문의를 한 곳에서 관리합니다.
        </p>

        {!isReady || !isAdmin ? (
          <AdminGuardMessage message={guardMessage} showLoginLink={showLoginLink} className="mt-8" />
        ) : (
          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 bg-[#171611] p-6 transition hover:border-[#d6a84f]"
              >
                <h2 className="text-xl font-black text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              </Link>
            ))}
          </section>
        )}
        </div>
      </main>
    </>
  );
}

"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import {
  orderMenuItems,
  pendingAccountMenuItems,
  pendingOrderMenuItems,
} from "@/components/my-page/my-page.constants";
import { MyPageMenuSection } from "@/components/my-page/MyPageMenuSection";
import { MyPageProfileCard } from "@/components/my-page/MyPageProfileCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            회원 정보를 불러오는 중입니다.
          </section>
        ) : user ? (
          <section className="grid gap-6">
            <MyPageProfileCard user={user} onLogout={handleLogout} />

            <div className="grid gap-6 lg:grid-cols-2">
              <MyPageMenuSection
                title="주문·배송"
                linkItems={orderMenuItems}
                pendingItems={pendingOrderMenuItems}
                sideLink={{ href: "/cart", label: "장바구니" }}
              />
              <MyPageMenuSection title="계정 관리" pendingItems={pendingAccountMenuItems} />
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
            <p className="text-sm font-bold text-zinc-300">
              로그인하면 내 정보를 확인할 수 있습니다.
            </p>
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

"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import OilHeader from "@/components/layout/OilHeader";
import { MyPageAccountInfoSection } from "@/components/my-page/MyPageAccountInfoSection";
import { MyPageLayout } from "@/components/my-page/MyPageLayout";
import { MyPageProfileCard } from "@/components/my-page/MyPageProfileCard";
import { MyPageSecuritySection } from "@/components/my-page/MyPageSecuritySection";
import { MyPageWithdrawalPanel } from "@/components/my-page/MyPageWithdrawalPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CompletionModal = {
  title: string;
  message: string;
};

const MyPageContainer = () => {
  const router = useRouter();
  const { user, isReady, logout, withdraw } = useAuth();
  const [completionModal, setCompletionModal] = useState<CompletionModal | null>(null);

  const handleLogout = async () => {
    await logout();
    setCompletionModal({
      title: "로그아웃 완료",
      message: "로그아웃되었습니다.",
    });
  };

  const handleWithdraw = async () => {
    await withdraw();
    setCompletionModal({
      title: "회원탈퇴 신청 완료",
      message: "회원탈퇴 신청이 완료되었습니다.",
    });
  };

  return (
    <>
      <ConfirmModal
        isOpen={completionModal !== null}
        title={completionModal?.title ?? ""}
        message={completionModal?.message ?? ""}
        tone="success"
        onConfirm={() => {
          setCompletionModal(null);
          router.replace("/");
        }}
      />

      <OilHeader />

      <MyPageLayout activeMenu="profile" contentClassName="grid gap-8">
        <section className="w-full max-w-[1040px]">
          <div className="mb-8">
            <p className="mb-3 text-sm font-black text-[#ff4b1f]">MY PAGE</p>
            <h1 className="text-3xl font-black text-[#071d3b]">내 정보</h1>
          </div>

          {!isReady ? (
            <section className="rounded-lg border border-[#dde2e8] bg-white px-6 py-16 text-center text-sm font-bold text-[#65717f]">
              회원 정보를 불러오는 중입니다.
            </section>
          ) : user ? (
            <div className="grid gap-8">
              <MyPageProfileCard user={user} onLogout={handleLogout} />
              <MyPageAccountInfoSection user={user} />
              <MyPageSecuritySection />
              <MyPageWithdrawalPanel onWithdraw={handleWithdraw} />
            </div>
          ) : (
            <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
              <p className="text-sm font-bold text-[#65717f]">
                로그인하면 내 정보를 확인할 수 있습니다.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
              >
                로그인하러 가기
              </Link>
            </section>
          )}
        </section>
      </MyPageLayout>
    </>
  );
};

export default MyPageContainer;

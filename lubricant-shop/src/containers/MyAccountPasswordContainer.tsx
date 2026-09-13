"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import OilHeader from "@/components/layout/OilHeader";
import { MyPageLayout } from "@/components/my-page/MyPageLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const inputClassName =
  "h-12 rounded-md border border-[#dce2e8] bg-white px-4 text-sm font-bold text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]";

const passwordRequirementClassName = (isValid: boolean) =>
  isValid ? "text-[#1f7a3f]" : "text-[#8a94a1]";

export default function MyAccountPasswordContainer() {
  const router = useRouter();
  const { user, isReady, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const guardMessage = !isReady
    ? "회원 정보를 불러오는 중입니다."
    : !user
      ? "로그인하면 비밀번호를 변경할 수 있습니다."
      : "";
  const passwordRequirements = {
    hasMinLength: newPassword.length >= 8,
    hasLowercase: /[a-z]/.test(newPassword),
    hasUppercase: /[A-Z]/.test(newPassword),
    hasSpecialCharacter: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isNewPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!isNewPasswordValid) {
      setMessage("새 비밀번호는 소문자, 대문자, 특수문자를 포함해 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        title="비밀번호 변경 완료"
        message="비밀번호가 변경되었습니다."
        tone="success"
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.push("/my-page");
        }}
      />

      <OilHeader />

      <MyPageLayout activeMenu="profile">
        <section className="w-full max-w-[720px]">
          <div className="mb-8">
            <Link
              href="/my-page"
              className="text-sm font-bold text-[#65717f] hover:text-[#ff4b1f]"
            >
              내 정보로 돌아가기
            </Link>
            <p className="mt-8 text-sm font-black text-[#ff6a42]">ACCOUNT SECURITY</p>
            <h1 className="mt-3 text-3xl font-black text-[#071d3b]">비밀번호 변경</h1>
          </div>

          {guardMessage ? (
            <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
              <p className="text-sm font-bold text-[#65717f]">{guardMessage}</p>
            </section>
          ) : null}

          {user?.provider === "email" ? (
            <form
              className="rounded-lg border border-[#dde2e8] bg-white p-6 shadow-[0_12px_28px_rgba(7,29,59,0.05)]"
              onSubmit={handlePasswordSubmit}
            >
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-black text-[#34465c]">
                  현재 비밀번호
                  <input
                    className={inputClassName}
                    autoComplete="current-password"
                    placeholder="현재 비밀번호"
                    required
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-[#34465c]">
                  새 비밀번호
                  <input
                    className={inputClassName}
                    autoComplete="new-password"
                    placeholder="새 비밀번호"
                    required
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <ul className="grid gap-1 text-xs font-bold" aria-label="비밀번호 조건">
                    <li className={passwordRequirementClassName(passwordRequirements.hasMinLength)}>
                      8자 이상
                    </li>
                    <li className={passwordRequirementClassName(passwordRequirements.hasUppercase)}>
                      대문자 포함
                    </li>
                    <li className={passwordRequirementClassName(passwordRequirements.hasLowercase)}>
                      소문자 포함
                    </li>
                    <li className={passwordRequirementClassName(passwordRequirements.hasSpecialCharacter)}>
                      특수문자 포함
                    </li>
                  </ul>
                </label>
                <label className="grid gap-2 text-sm font-black text-[#34465c]">
                  새 비밀번호 확인
                  <input
                    className={inputClassName}
                    autoComplete="new-password"
                    placeholder="새 비밀번호 확인"
                    required
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(event) => setNewPasswordConfirm(event.target.value)}
                  />
                </label>
              </div>
              {message ? (
                <p className="mt-3 text-sm font-bold text-[#65717f]">{message}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="h-11 rounded-md bg-[#071d3b] px-6 text-sm font-black text-white transition hover:bg-[#12345f] disabled:cursor-not-allowed disabled:bg-[#d8dde3] disabled:text-[#8a94a1]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "변경 중" : "변경하기"}
                </button>
                <Link
                  href="/my-page"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-[#b8c2cf] bg-white px-6 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
                >
                  취소
                </Link>
              </div>
            </form>
          ) : null}

          {user && user.provider !== "email" ? (
            <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
              <p className="text-sm font-bold text-[#65717f]">
                소셜 로그인 계정은 비밀번호 변경을 지원하지 않습니다.
              </p>
            </section>
          ) : null}
        </section>
      </MyPageLayout>
    </>
  );
}

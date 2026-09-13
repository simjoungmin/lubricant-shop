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

type NameEditFormProps = {
  initialName: string;
  onUpdateName: (name: string) => Promise<void>;
};

function NameEditForm({ initialName, onUpdateName }: NameEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("이름을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateName(trimmedName);
      setIsSuccessModalOpen(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "이름 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        title="이름 변경 완료"
        message="이름이 변경되었습니다."
        tone="success"
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.push("/my-page");
        }}
      />

      <form
        className="rounded-lg border border-[#dde2e8] bg-white p-6 shadow-[0_12px_28px_rgba(7,29,59,0.05)]"
        onSubmit={handleNameSubmit}
      >
        <label className="grid gap-2 text-sm font-black text-[#34465c]">
          현재 이름
          <input
            className={inputClassName}
            maxLength={80}
            placeholder="변경할 이름"
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        {message ? (
          <p className="mt-3 text-sm font-bold text-[#65717f]">{message}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="h-11 rounded-md bg-[#071d3b] px-6 text-sm font-black text-white transition hover:bg-[#12345f] disabled:cursor-not-allowed disabled:bg-[#d8dde3] disabled:text-[#8a94a1]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "저장 중" : "저장"}
          </button>
          <Link
            href="/my-page"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#b8c2cf] bg-white px-6 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
          >
            취소
          </Link>
        </div>
      </form>
    </>
  );
}

export default function MyAccountNameContainer() {
  const { user, isReady, updateName } = useAuth();

  const guardMessage = !isReady
    ? "회원 정보를 불러오는 중입니다."
    : !user
      ? "로그인하면 이름을 변경할 수 있습니다."
      : "";

  return (
    <>
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
            <p className="mt-8 text-sm font-black text-[#ff6a42]">ACCOUNT</p>
            <h1 className="mt-3 text-3xl font-black text-[#071d3b]">이름 변경</h1>
          </div>

          {guardMessage ? (
            <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
              <p className="text-sm font-bold text-[#65717f]">{guardMessage}</p>
            </section>
          ) : null}

          {user ? (
            <NameEditForm
              initialName={user.name}
              onUpdateName={async (nextName) => {
                await updateName({ name: nextName });
              }}
            />
          ) : null}
        </section>
      </MyPageLayout>
    </>
  );
}

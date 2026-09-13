"use client";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useState } from "react";

type MyPageWithdrawalPanelProps = {
  onWithdraw: () => Promise<void>;
};

export function MyPageWithdrawalPanel({ onWithdraw }: MyPageWithdrawalPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setIsConfirmModalOpen(false);
      await onWithdraw();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "회원탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-[#dce2e8] pt-5">
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="회원탈퇴 신청"
        message="회원탈퇴 신청 후 7일 동안 계정이 정지됩니다. 기간 안에 로그인하면 계정이 복구됩니다. 계속 진행할까요?"
        confirmLabel="탈퇴 신청"
        cancelLabel="취소"
        tone="danger"
        onConfirm={() => void handleWithdraw()}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-bold leading-6 text-[#65717f]">
          탈퇴 신청 후 7일 안에 로그인하면 계정이 복구됩니다.
        </p>

        <button
          type="button"
          className="self-start font-black text-[#d93636] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
          disabled={isSubmitting}
          onClick={() => setIsConfirmModalOpen(true)}
        >
          {isSubmitting ? "탈퇴 신청 중" : "회원탈퇴"}
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-3 text-sm font-bold text-[#d93636]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

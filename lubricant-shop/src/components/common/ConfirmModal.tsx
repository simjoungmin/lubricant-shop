"use client";

import { useEffect } from "react";

type ConfirmModalTone = "info" | "success" | "danger";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmModalTone;
  onConfirm: () => void;
  onCancel?: () => void;
};

const toneClassName: Record<ConfirmModalTone, string> = {
  info: "bg-[#071d3b] hover:bg-[#12345f]",
  success: "bg-[#1f7a3f] hover:bg-[#176130]",
  danger: "bg-[#d93636] hover:bg-[#b92c2c]",
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel,
  tone = "info",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onConfirm();
      }

      if (event.key === "Escape" && onCancel) {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-6"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-[420px] rounded-lg border border-[#dde2e8] bg-white p-5 shadow-[0_24px_60px_rgba(7,29,59,0.24)] sm:p-6"
      >
        <h2 id="confirm-modal-title" className="text-xl font-black text-[#071d3b]">
          {title}
        </h2>
        <p className="mt-3 text-sm font-bold leading-6 text-[#65717f]">{message}</p>
        <div className="mt-6 grid gap-2 sm:flex sm:justify-end">
          {cancelLabel && onCancel ? (
            <button
              type="button"
              className="h-11 rounded-md border border-[#b8c2cf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            className={`h-11 rounded-md px-5 text-sm font-black text-white transition ${toneClassName[tone]}`}
            autoFocus
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

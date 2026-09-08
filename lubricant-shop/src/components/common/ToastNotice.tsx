"use client";

import { useEffect, useState } from "react";

type ToastNoticeProps = {
  message: string;
};

export function ToastNotice({ message }: ToastNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("notice");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

    const timerId = window.setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-6 top-24 z-[60] w-[calc(100%-48px)] max-w-sm rounded-md border border-[#b8d8c2] bg-white px-5 py-4 text-sm font-black text-[#1f6b3a] shadow-[0_16px_40px_rgba(7,29,59,0.16)]"
    >
      {message}
    </div>
  );
}

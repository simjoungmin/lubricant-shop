"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

const deliveryLookupButtonClassName =
  "mt-7 flex h-12 w-full items-center justify-between border border-[#cfd6de] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f] disabled:cursor-not-allowed disabled:opacity-60";

export function DeliveryLookupLink() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);

  const handleDeliveryLookupClick = () => {
    if (!user) {
      setIsLoginRequiredModalOpen(true);
      return;
    }

    router.push("/my-page/orders");
  };

  return (
    <>
      <ConfirmModal
        isOpen={isLoginRequiredModalOpen}
        title="로그인이 필요합니다"
        message="로그인 후 이용 가능합니다."
        onConfirm={() => {
          setIsLoginRequiredModalOpen(false);
          router.push("/login");
        }}
      />

      <button
        type="button"
        className={deliveryLookupButtonClassName}
        disabled={!isReady}
        onClick={handleDeliveryLookupClick}
      >
        배송 조회하기
        <span aria-hidden="true">-&gt;</span>
      </button>
    </>
  );
}

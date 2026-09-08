"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { useHasUnreadAnswer } from "@/hooks/useInquiries";
import { useHydrated } from "@/hooks/useHydrated";
import Link from "next/link";

const iconClassName = "h-6 w-6";

const CartIcon = () => (
  <svg
    aria-hidden="true"
    className={iconClassName}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg
    aria-hidden="true"
    className={iconClassName}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const headerIconButtonClassName =
  "relative flex h-10 w-10 items-center justify-center rounded-md text-[#071d3b] transition hover:bg-[#f1f4f8] hover:text-[#ff4b1f]";

const OilHeader = () => {
  const { totalQuantity, toggleCart } = useCart();
  const { user } = useAuth();
  const hydrated = useHydrated();
  const unreadAnswerQuery = useHasUnreadAnswer(
    hydrated && Boolean(user) && user?.role !== "ADMIN",
  );

  const showUnreadAnswerDot =
    hydrated && user?.role !== "ADMIN" && Boolean(unreadAnswerQuery.data?.hasUnreadAnswer);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e8ed] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black text-[#071d3b]">
          OIL MASTER
        </Link>

        <nav className="hidden items-center gap-14 text-sm font-black text-[#071d3b] md:flex">
          <Link href="/category" className="hover:text-[#ff4b1f]">
            카테고리
          </Link>
          <Link href="/customer-center" className="hover:text-[#ff4b1f]">
            고객센터
          </Link>
          <Link href="/event" className="hover:text-[#ff4b1f]">
            이벤트
          </Link>
          <Link href="/brand" className="hover:text-[#ff4b1f]">
            회사소개
          </Link>
          {hydrated && user?.role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-[#ff4b1f]">
              관리자
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="장바구니 열기"
            className={headerIconButtonClassName}
            onClick={toggleCart}
          >
            <CartIcon />

            {hydrated && totalQuantity > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff4b1f] px-1 text-[10px] font-black leading-none text-white">
                {totalQuantity}
              </span>
            ) : null}
          </button>

          {hydrated && user ? (
            <Link
              href="/my-page"
              aria-label="내 정보 보기"
              title={`${user.name} 내 정보`}
              className={headerIconButtonClassName}
            >
              <UserIcon />
              {showUnreadAnswerDot ? (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null}
            </Link>
          ) : (
            <Link href="/login" aria-label="로그인" className={headerIconButtonClassName}>
              <UserIcon />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default OilHeader;

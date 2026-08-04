"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { useHasUnreadAnswer } from "@/hooks/useInquiries";
import { useHydrated } from "@/hooks/useHydrated";
import Link from "next/link";

const iconClassName = "h-5 w-5";

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

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
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
  "relative flex h-9 w-9 items-center justify-center rounded-md border border-white/10 transition hover:border-[#d6a84f] hover:text-[#d6a84f]";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d0b]/90 backdrop-blur">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d6a84f] text-sm font-black text-black">
            O
          </div>
          <span className="text-lg font-bold tracking-wide">OIL MASTER</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm text-zinc-300 md:flex">
          <Link href="/category" className="hover:text-[#d6a84f]">
            카테고리
          </Link>
          <Link href="/brand" className="hover:text-[#d6a84f]">
            브랜드
          </Link>
          <button type="button" className="hover:text-[#d6a84f]">
            이벤트
          </button>
          <Link href="/customer-center" className="hover:text-[#d6a84f]">
            고객센터
          </Link>
          {hydrated && user?.role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-[#d6a84f]">
              관리자
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 text-zinc-300">
          <button
            type="button"
            aria-label="장바구니 열기"
            className={headerIconButtonClassName}
            onClick={toggleCart}
          >
            <CartIcon />

            {hydrated && totalQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6a84f] px-1 text-[10px] font-black leading-none text-black">
                {totalQuantity}
              </span>
            ) : null}
          </button>

          <button type="button" aria-label="검색" className={headerIconButtonClassName}>
            <SearchIcon />
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
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0d0d0b]" />
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

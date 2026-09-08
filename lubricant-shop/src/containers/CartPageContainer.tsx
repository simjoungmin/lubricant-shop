"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import OilHeader from "@/components/layout/OilHeader";
import Link from "next/link";

export default function CartPageContainer() {
  const { user, isReady } = useAuth();
  const {
    items,
    totalQuantity,
    totalPrice,
    expectedRewardPoint,
    isLoading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <>
      <OilHeader />
      <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black text-[#ff4b1f]">CART</p>
            <h1 className="mt-3 text-3xl font-black text-[#071d3b]">장바구니</h1>
            <p className="mt-3 text-sm leading-6 text-[#65717f]">
              주문할 상품과 수량을 확인한 뒤 주문서로 이동하세요.
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#aab3bf] bg-white px-5 text-sm font-black text-[#071d3b] transition hover:border-[#ff4b1f] hover:text-[#ff4b1f]"
          >
            쇼핑 계속하기
          </Link>
        </div>

        {!isReady || isLoading ? (
          <section className="rounded-lg border border-[#dde2e8] bg-white px-6 py-16 text-center text-sm font-bold text-[#65717f]">
            장바구니를 불러오는 중입니다.
          </section>
        ) : !user ? (
          <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
            <p className="text-sm font-bold text-[#65717f]">
              로그인 후 장바구니를 이용할 수 있습니다.
            </p>
            <Link
              href="/login?redirect=%2Fcart"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
            >
              로그인하러 가기
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartItemCard
                    key={item.cartId}
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-[#dde2e8] bg-white px-6 py-16 text-center">
                  <p className="text-lg font-black text-[#071d3b]">
                    장바구니가 비어 있습니다.
                  </p>
                  <p className="mt-2 text-sm text-[#65717f]">
                    필요한 상품을 담고 다시 확인해 주세요.
                  </p>
                </div>
              )}
            </section>

            <aside className="h-fit rounded-lg border border-[#dde2e8] bg-white p-5">
              <h2 className="text-lg font-black text-[#071d3b]">주문 요약</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-[#65717f]">
                  <span>상품 수량</span>
                  <strong className="text-[#071d3b]">{totalQuantity}개</strong>
                </div>
                <div className="flex justify-between text-[#65717f]">
                  <span>상품 합계</span>
                  <strong className="text-[#071d3b]">{formatPrice(totalPrice)}</strong>
                </div>
                <div className="flex justify-between text-[#65717f]">
                  <span>예상 적립</span>
                  <strong className="text-[#ff4b1f]">
                    {expectedRewardPoint.toLocaleString("ko-KR")} P
                  </strong>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/order"
                  aria-disabled={items.length === 0}
                  className={`flex h-12 items-center justify-center rounded-md text-sm font-black transition ${
                    items.length === 0
                      ? "pointer-events-none bg-[#d8dde3] text-[#8a94a1]"
                      : "bg-[#ff4b1f] text-white hover:bg-[#e63e16]"
                  }`}
                >
                  주문서 작성
                </Link>
                <button
                  type="button"
                  disabled={items.length === 0}
                  className="h-11 rounded-md border border-[#dce2e8] text-sm font-black text-[#65717f] transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-[#b9c1ca]"
                  onClick={clearCart}
                >
                  장바구니 비우기
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import CartItemCard from "@/components/cart/CartItemCard";
import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CartDrawerProps = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  expectedRewardPoint: number;
  isLoading: boolean;
  onClose: () => void;
  onIncrease: (cartId: number) => void;
  onDecrease: (cartId: number) => void;
  onRemove: (cartId: number) => void;
};

const CartDrawer = ({
  items,
  totalQuantity,
  totalPrice,
  expectedRewardPoint,
  isLoading,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}: CartDrawerProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [usePoints, setUsePoints] = useState(false);
  const [pointAmount, setPointAmount] = useState(0);
  const pointBalance = user?.pointBalance ?? 0;
  const maxUsablePoint = Math.min(pointBalance, totalPrice);
  const usablePointAmount = usePoints
    ? Math.min(Math.max(0, pointAmount), maxUsablePoint)
    : 0;
  const paymentAmount = totalPrice - usablePointAmount;

  const handlePointAmountChange = (value: string) => {
    const nextPointAmount = Number(value.replace(/[^0-9]/g, ""));
    const safePointAmount = Number.isFinite(nextPointAmount) ? nextPointAmount : 0;
    setPointAmount(Math.min(safePointAmount, maxUsablePoint));
  };

  const handleCheckout = () => {
    router.push("/order");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="장바구니 닫기"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-[#f7f7f5] text-[#071d3b] shadow-2xl">
        <header className="border-b border-[#e2e6eb] bg-white px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[#ff4b1f]">Cart</p>
              <h2 className="mt-1 text-2xl font-black">장바구니</h2>
            </div>
            <button
              type="button"
              aria-label="장바구니 닫기"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dce2e8] text-lg font-black text-[#65717f] transition hover:border-[#ff8a65] hover:text-[#ff4b1f]"
              onClick={onClose}
            >
              x
            </button>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-flex text-sm font-black text-[#ff4b1f] transition hover:text-[#071d3b]"
            onClick={onClose}
          >
            장바구니 전체 보기
          </Link>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-md bg-[#f5f7f9] px-3 py-3">
              <p className="text-xs font-bold text-[#65717f]">상품</p>
              <p className="mt-1 text-lg font-black">{totalQuantity}개</p>
            </div>
            <div className="rounded-md bg-[#f5f7f9] px-3 py-3">
              <p className="text-xs font-bold text-[#65717f]">적립 예정</p>
              <p className="mt-1 text-lg font-black">
                {expectedRewardPoint.toLocaleString("ko-KR")}P
              </p>
            </div>
            <div className="rounded-md bg-[#071d3b] px-3 py-3 text-white">
              <p className="text-xs font-bold text-white/70">결제 예정</p>
              <p className="mt-1 text-lg font-black text-[#ff8a65]">
                {formatPrice(paymentAmount)}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading ? (
            <div className="flex h-full min-h-[260px] items-center justify-center rounded-lg border border-dashed border-[#cfd6de] bg-white text-sm font-bold text-[#65717f]">
              장바구니를 불러오는 중입니다.
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartId}
                  item={item}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-[#cfd6de] bg-white px-6 text-center">
              <p className="text-lg font-black">담긴 상품이 없습니다.</p>
              <p className="mt-2 text-sm font-medium text-[#65717f]">
                필요한 오일과 소모품을 담으면 장바구니에서 한 번에 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <footer className="border-t border-[#e2e6eb] bg-white px-5 py-5">
          <div className="rounded-lg border border-[#dde2e8] bg-[#fbfcfd] p-4">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="font-black">포인트 사용</span>
              <input
                type="checkbox"
                checked={usePoints}
                disabled={pointBalance === 0 || totalQuantity === 0}
                className="accent-[#ff4b1f]"
                onChange={(event) => setUsePoints(event.target.checked)}
              />
            </label>
            <div className="mt-2 flex items-center justify-between text-xs font-bold text-[#65717f]">
              <span>보유 포인트</span>
              <span>{pointBalance.toLocaleString("ko-KR")} P</span>
            </div>
            {usePoints ? (
              <input
                type="text"
                inputMode="numeric"
                value={pointAmount.toLocaleString("ko-KR")}
                onChange={(event) => handlePointAmountChange(event.target.value)}
                className="mt-3 h-11 w-full rounded-md border border-[#dce2e8] bg-white px-3 text-sm font-black outline-none transition focus:border-[#071d3b]"
              />
            ) : null}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-[#65717f]">
              <span>상품 합계</span>
              <strong className="text-[#071d3b]">{formatPrice(totalPrice)}</strong>
            </div>
            <div className="flex items-center justify-between text-[#65717f]">
              <span>포인트 할인</span>
              <strong>-{usablePointAmount.toLocaleString("ko-KR")} P</strong>
            </div>
            <div className="flex items-center justify-between border-t border-[#e2e6eb] pt-3">
              <span className="font-black">최종 결제금액</span>
              <strong className="text-xl font-black text-[#ff4b1f]">
                {formatPrice(paymentAmount)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            disabled={totalQuantity === 0}
            className="mt-5 h-12 w-full rounded-md bg-[#ff4b1f] text-sm font-black text-white transition hover:bg-[#e63e16] disabled:cursor-not-allowed disabled:bg-[#d8dde3] disabled:text-[#8a94a1]"
            onClick={handleCheckout}
          >
            주문서로 이동
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default CartDrawer;

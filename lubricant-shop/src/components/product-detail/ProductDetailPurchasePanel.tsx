"use client";

import type { Product } from "@/assets/category/types";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice, getDiscountRate } from "@/components/cart/cart.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductDetailPurchasePanelProps = {
  product: Product;
};

export default function ProductDetailPurchasePanel({
  product,
}: ProductDetailPurchasePanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const discountRate = getDiscountRate(product.originalPrice, product.price);
  const rewardRate = product.pointRewardRatePercent ?? 0;
  const expectedRewardPoint = Math.floor(product.price * quantity * (rewardRate / 100));
  const totalPrice = product.price * quantity;
  const isUnavailable =
    (product.saleStatus !== undefined && product.saleStatus !== "ON_SALE") ||
    (product.stock !== undefined && product.stock <= 0);

  const handleDecreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((currentQuantity) => {
      if (product.stock === undefined) {
        return currentQuantity + 1;
      }

      return Math.min(product.stock, currentQuantity + 1);
    });
  };

  const handleAddToCart = () => {
    void addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push("/login?redirect=%2Forder");
      return;
    }

    const isAdded = await addToCart(product, quantity);

    if (isAdded) {
      router.push("/order");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-2 text-sm text-[#071d3b]">
        <span className="text-xl leading-none text-[#ffd200]">★</span>
        <span>0</span>
      </div>

      <h1 className="mt-3 text-xl font-black leading-7 text-[#111827]">
        {product.name}
      </h1>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[#e5e7eb] pb-4">
        {discountRate > 0 ? (
          <span className="text-3xl font-medium text-[#e11919]">
            {discountRate}%
          </span>
        ) : null}
        <strong className="text-3xl font-black text-[#2276dc]">
          {formatPrice(product.price)}
        </strong>
        {discountRate > 0 ? (
          <span className="text-sm text-[#777] line-through">
            {formatPrice(product.originalPrice ?? product.price)}
          </span>
        ) : null}
      </div>

      <dl className="divide-y divide-[#edf0f3] text-sm">
        <div className="grid grid-cols-[100px_1fr] py-4">
          <dt className="text-[#222]">적립 포인트</dt>
          <dd className="font-medium text-[#111827]">
            {expectedRewardPoint.toLocaleString("ko-KR")}원
          </dd>
        </div>
        <div className="grid grid-cols-[100px_1fr] py-4">
          <dt className="text-[#222]">배송비</dt>
          <dd className="font-medium text-[#111827]">무료</dd>
        </div>
      </dl>

      <div className="border border-[#dfe5ec] bg-[#f1f3f6] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-9 w-[110px] items-center justify-between overflow-hidden rounded-md border border-[#d9dee6] bg-white">
            <button
              type="button"
              aria-label="수량 감소"
              disabled={quantity <= 1 || isUnavailable}
              className="h-full w-9 text-lg text-[#a0a7b0] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleDecreaseQuantity}
            >
              -
            </button>
            <span className="min-w-8 text-center text-sm font-black text-[#111827]">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="수량 증가"
              disabled={isUnavailable || product.stock === quantity}
              className="h-full w-9 text-lg text-[#555] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleIncreaseQuantity}
            >
              +
            </button>
          </div>

          <strong className="text-base font-black text-[#111827]">
            {formatPrice(totalPrice)}
          </strong>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-b border-[#e5e7eb] pb-4 text-sm">
        <span className="font-bold text-[#111827]">총 금액</span>
        <strong className="text-2xl font-black text-[#2276dc]">
          {formatPrice(totalPrice)}
        </strong>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1.8fr] gap-3">
        <button
          type="button"
          disabled={isUnavailable}
          className="h-12 rounded-md bg-[#e8f2ff] text-sm font-black text-[#0d66d0] transition hover:bg-[#d9eaff] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleAddToCart}
        >
          장바구니
        </button>
        <button
          type="button"
          disabled={isUnavailable}
          className="h-12 rounded-md bg-[#2878d9] text-sm font-black text-white transition hover:bg-[#1f68c0] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleBuyNow}
        >
          구매하기
        </button>
      </div>
    </div>
  );
}

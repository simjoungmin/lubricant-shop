"use client";

import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "@/components/cart/cart.utils";
import Image from "next/image";

type CartItemCardProps = {
  item: CartItem;
  onIncrease: (cartId: number) => void;
  onDecrease: (cartId: number) => void;
  onRemove: (cartId: number) => void;
};

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) => {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-4 rounded-lg border border-zinc-200 bg-white p-3 text-zinc-950 shadow-sm">
      <div className="relative h-[72px] overflow-hidden rounded-md bg-zinc-100">
        <Image
          src={item.product.imageUrl || "/product-images/oil-bottle.svg"}
          alt={item.product.name}
          fill
          sizes="72px"
          className="object-contain p-2"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{item.product.name}</p>
            <p className="mt-1 truncate text-xs font-medium text-zinc-500">
              {item.product.brand} · {item.product.spec || "규격 정보 없음"}
            </p>
            <p className="mt-2 text-sm font-black text-zinc-950">
              {formatPrice(item.product.price)}
            </p>
          </div>
          <button
            type="button"
            aria-label={`${item.product.name} 삭제`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-sm font-bold text-zinc-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            onClick={() => onRemove(item.cartId)}
          >
            x
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex h-9 items-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
            <button
              type="button"
              aria-label={`${item.product.name} 수량 줄이기`}
              className="flex h-9 w-9 items-center justify-center text-sm font-black text-zinc-600 transition hover:bg-zinc-100"
              onClick={() => onDecrease(item.cartId)}
            >
              -
            </button>
            <span className="flex h-9 min-w-10 items-center justify-center border-x border-zinc-200 bg-white text-sm font-black">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`${item.product.name} 수량 늘리기`}
              className="flex h-9 w-9 items-center justify-center text-sm font-black text-zinc-600 transition hover:bg-zinc-100"
              onClick={() => onIncrease(item.cartId)}
            >
              +
            </button>
          </div>
          <strong className="text-sm font-black text-[#b17916]">
            {formatPrice(item.totalPrice)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;

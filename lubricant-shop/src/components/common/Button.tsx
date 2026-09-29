"use client";

import type { Product } from "@/assets/category/types";
import { useCart } from "@/components/cart/CartContext";
import React from "react";

type ButtonKind = "cart";

type ButtonProps = {
  type: ButtonKind;
  product?: Product;
  className?: string;
  children?: React.ReactNode;
};

const typeClassNames: Record<ButtonKind, string> = {
  cart: "text-sm text-[#d6a84f] transition hover:text-white",
};

const Button = ({ type, product, className = "", children }: ButtonProps) => {
  const { addToCart } = useCart();
  const isCartUnavailable =
    type === "cart"
    && product !== undefined
    && ((product.saleStatus !== undefined && product.saleStatus !== "ON_SALE")
      || (product.stock !== undefined && product.stock <= 0));

  const handleClick = () => {
    if (type === "cart" && product) {
      void addToCart(product);
    }
  };

  return (
    <button
      type="button"
      aria-label={
        type === "cart" && product ? `${product.name} 장바구니 담기` : undefined
      }
      disabled={isCartUnavailable}
      title={isCartUnavailable ? "현재 구매할 수 없는 상품입니다." : undefined}
      className={`${typeClassNames[type]} ${className} disabled:cursor-not-allowed disabled:opacity-60`.trim()}
      onClick={handleClick}
    >
      {children ?? (type === "cart" ? "담기" : null)}
    </button>
  );
};

export default Button;

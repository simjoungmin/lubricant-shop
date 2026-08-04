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

  const handleClick = () => {
    if (type === "cart" && product) {
      addToCart(product);
    }
  };

  return (
    <button
      type="button"
      aria-label={
        type === "cart" && product ? `${product.name} 장바구니 담기` : undefined
      }
      className={`${typeClassNames[type]} ${className}`.trim()}
      onClick={handleClick}
    >
      {children ?? (type === "cart" ? "담기" : null)}
    </button>
  );
};

export default Button;

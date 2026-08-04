export type CartProduct = {
  id: number;
  name: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  imageUrl: string;
  spec: string;
  pointRewardRatePercent: number;
  saleStatus: "ON_SALE" | "SOLD_OUT" | "STOPPED" | "HIDDEN";
};

export type ServerCartItem = {
  cartId: number;
  productId: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  imageUrl: string;
  specification: string | null;
  pointRewardRatePercent: number;
  saleStatus: CartProduct["saleStatus"];
  quantity: number;
  totalPrice: number;
  pointEarned: number;
  updatedAt: string;
};

export type CartItem = {
  cartId: number;
  product: CartProduct;
  quantity: number;
  totalPrice: number;
  pointEarned: number;
};

export type CartResponse = {
  items: ServerCartItem[];
  totalQuantity: number;
  totalPrice: number;
  expectedRewardPoint: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const toCartItem = (item: ServerCartItem): CartItem => ({
  cartId: item.cartId,
  product: {
    id: item.productId,
    name: item.productName,
    categorySlug: item.category,
    brand: item.brand,
    price: Number(item.price),
    originalPrice: Number(item.originalPrice),
    stock: item.stock,
    imageUrl: item.imageUrl,
    spec: item.specification ?? "",
    pointRewardRatePercent: Number(item.pointRewardRatePercent),
    saleStatus: item.saleStatus,
  },
  quantity: item.quantity,
  totalPrice: Number(item.totalPrice),
  pointEarned: item.pointEarned,
});

const requestCart = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "장바구니 요청 처리에 실패했습니다.");
  }

  const data = (await response.json()) as CartResponse;

  return {
    items: data.items.map(toCartItem),
    totalQuantity: data.totalQuantity,
    totalPrice: Number(data.totalPrice),
    expectedRewardPoint: data.expectedRewardPoint,
  };
};

export const cartApi = {
  findCart: () => requestCart("/api/cart"),

  addItem: (productId: number, quantity = 1) =>
    requestCart("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  updateQuantity: (cartId: number, quantity: number) =>
    requestCart(`/api/cart/items/${cartId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (cartId: number) =>
    requestCart(`/api/cart/items/${cartId}`, {
      method: "DELETE",
    }),

  clearCart: () =>
    requestCart("/api/cart", {
      method: "DELETE",
    }),
};

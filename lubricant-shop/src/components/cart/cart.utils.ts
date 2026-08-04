export const parsePrice = (price: string) => {
  return Number(price.replace(/[^0-9]/g, ""));
};

export const formatPrice = (price: number) => {
  return `${price.toLocaleString("ko-KR")}원`;
};

export const getCartItemTotalPrice = (price: number, quantity: number) => {
  return price * quantity;
};

export const getProductRewardRate = (categorySlug: string) => {
  if (categorySlug === "engine" || categorySlug === "gear") {
    return 5;
  }

  if (categorySlug === "mission" || categorySlug === "brake") {
    return 3;
  }

  return 2;
};

export const getCartItemRewardPoint = (
  price: number,
  quantity: number,
  rewardRatePercent: number,
) => {
  return Math.floor((price * quantity * rewardRatePercent) / 100);
};

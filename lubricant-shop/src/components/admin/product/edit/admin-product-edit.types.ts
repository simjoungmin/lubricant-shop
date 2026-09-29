import type { ProductStatus } from "@/components/admin/admin.api";

export type ProductEditForm = {
  productName: string;
  brand: string;
  category: string;
  subCategory: string;
  subCategories: string[];
  productDescription: string;
  imageUrl: string;
  saleStatus: ProductStatus;
  viscosity: string;
  specification: string;
  volume: string;
  price: string;
  discountPrice: string;
  stock: string;
  pointRewardRatePercent: string;
};

export type ProductEditFormChangeHandler = <Key extends keyof ProductEditForm>(
  key: Key,
  value: ProductEditForm[Key],
) => void;

export const productEditInputClassName =
  "h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";

export const productEditTextareaClassName =
  "min-h-32 rounded-md border border-white/10 bg-[#11100d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";

export const productEditLabelClassName = "grid gap-2 text-xs font-black text-zinc-500";

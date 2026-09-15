"use client";

import {
  type AdminProduct,
  type AdminProductUpdateInput,
} from "@/components/admin/admin.api";
import type { AdminNoticeVariant } from "@/components/admin/AdminGuardMessage";
import { AdminProductBasicForm } from "@/components/admin/product/edit/AdminProductBasicForm";
import {
  type ProductEditForm,
  type ProductEditFormChangeHandler,
} from "@/components/admin/product/edit/admin-product-edit.types";
import { AdminProductOilSpecForm } from "@/components/admin/product/edit/AdminProductOilSpecForm";
import { AdminProductPriceStockForm } from "@/components/admin/product/edit/AdminProductPriceStockForm";
import { useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type AdminProductEditFormProps = {
  product: AdminProduct;
};

type AdminNotice = {
  message: string;
  variant: AdminNoticeVariant;
};

const noticeClassName: Record<AdminNoticeVariant, string> = {
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  info: "border-white/10 bg-[#171611] text-zinc-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};

const toForm = (product: AdminProduct): ProductEditForm => ({
  productName: product.productName,
  brand: product.brand,
  category: product.category,
  subCategory: product.subCategory ?? "",
  productDescription: product.productDescription ?? "",
  imageUrl: product.imageUrl ?? "",
  saleStatus: product.saleStatus,
  viscosity: product.viscosity ?? "",
  specification: product.specification ?? "",
  volume: product.volume ?? "",
  price: String(product.price),
  discountPrice: product.discountPrice === null ? "" : String(product.discountPrice),
  stock: String(product.stock),
  pointRewardRatePercent: String(product.pointRewardRatePercent),
});

const toNumber = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

export function AdminProductEditForm({ product }: AdminProductEditFormProps) {
  const router = useRouter();
  const updateProductMutation = useUpdateAdminProduct();
  const [form, setForm] = useState<ProductEditForm>(() => toForm(product));
  const [notice, setNotice] = useState<AdminNotice | null>(null);

  const updateForm: ProductEditFormChangeHandler = (key, value) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = buildProductUpdateInput(form);

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId: product.productId,
        input,
      });
      setForm(toForm(updatedProduct));
      setNotice({ message: "상품 정보가 저장되었습니다.", variant: "success" });
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "상품 저장에 실패했습니다.",
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <AdminProductBasicForm
        productId={product.productId}
        form={form}
        onChange={updateForm}
      />
      <AdminProductOilSpecForm form={form} onChange={updateForm} />
      <AdminProductPriceStockForm form={form} onChange={updateForm} />

      {notice ? (
        <p className={`rounded-lg border p-4 text-sm font-bold ${noticeClassName[notice.variant]}`}>
          {notice.message}
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="h-11 rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
        >
          목록
        </button>
        <button
          type="submit"
          disabled={updateProductMutation.isPending}
          className="h-11 rounded-md bg-[#d6a84f] px-6 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {updateProductMutation.isPending ? "저장 중" : "저장"}
        </button>
      </div>
    </form>
  );
}

function buildProductUpdateInput(form: ProductEditForm): AdminProductUpdateInput {
  const input: AdminProductUpdateInput = {
    productName: form.productName.trim(),
    brand: form.brand.trim(),
    category: form.category,
    subCategory: form.subCategory,
    productDescription: form.productDescription.trim(),
    imageUrl: form.imageUrl.trim(),
    saleStatus: form.saleStatus,
    viscosity: form.viscosity.trim(),
    specification: form.specification.trim(),
    volume: form.volume.trim(),
    price: toNumber(form.price),
    stock: Math.max(0, Math.floor(toNumber(form.stock))),
    pointRewardRatePercent: toNumber(form.pointRewardRatePercent),
  };

  if (form.discountPrice.trim()) {
    input.discountPrice = toNumber(form.discountPrice);
  } else {
    input.shouldClearDiscountPrice = true;
  }

  return input;
}

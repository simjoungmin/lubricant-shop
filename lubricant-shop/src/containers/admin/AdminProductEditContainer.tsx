"use client";

import {
  type AdminProduct,
  type AdminProductUpdateInput,
  type ProductStatus,
} from "@/components/admin/admin.api";
import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminProduct, useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type AdminProductEditContainerProps = {
  productId: number;
};

type ProductEditForm = {
  productName: string;
  brand: string;
  category: string;
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
  mainProduct: boolean;
  recommended: boolean;
};

const productStatusLabel: Record<ProductStatus, string> = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  STOPPED: "판매중지",
  HIDDEN: "임시 저장",
};

const categoryOptions = [
  { label: "엔진오일", value: "engine" },
  { label: "미션오일", value: "mission" },
  { label: "브레이크액", value: "brake" },
  { label: "필터", value: "filter" },
  { label: "기어 오일", value: "gear" },
  { label: "케미컬", value: "chemical" },
];

const statusOptions = Object.keys(productStatusLabel) as ProductStatus[];

const inputClassName =
  "h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";
const textareaClassName =
  "min-h-32 rounded-md border border-white/10 bg-[#11100d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";
const labelClassName = "grid gap-2 text-xs font-black text-zinc-500";

const toForm = (product: AdminProduct): ProductEditForm => ({
  productName: product.productName,
  brand: product.brand,
  category: product.category,
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
  mainProduct: product.mainProduct,
  recommended: product.recommended,
});

const toNumber = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

export default function AdminProductEditContainer({
  productId,
}: AdminProductEditContainerProps) {
  const { user, isReady } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const productQuery = useAdminProduct(productId, isReady && isAdmin);

  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 상품을 수정할 수 있습니다."
      : productQuery.isPending
        ? "상품 정보를 불러오는 중입니다."
        : productQuery.isError
          ? productQuery.error.message
          : "";

  return (
    <>
      <OilHeader />
      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1180px] px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin/products" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
              상품 관리로 돌아가기
            </Link>
            <p className="mt-6 text-sm font-black text-[#d6a84f]">PRODUCT EDIT</p>
            <h1 className="mt-3 text-3xl font-black text-white">상품 수정</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              판매에 필요한 기본 정보, 가격, 재고를 관리합니다.
            </p>
          </div>
        </div>

        {guardMessage ? (
          <section className="rounded-lg border border-white/10 bg-[#171611] p-5">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
          </section>
        ) : null}

        {productQuery.data ? (
          <AdminProductEditForm key={productId} product={productQuery.data} />
        ) : null}
      </main>
    </>
  );
}

function AdminProductEditForm({ product }: { product: AdminProduct }) {
  const router = useRouter();
  const updateProductMutation = useUpdateAdminProduct();
  const [form, setForm] = useState<ProductEditForm>(() => toForm(product));
  const [message, setMessage] = useState("");

  const updateForm = <Key extends keyof ProductEditForm>(
    key: Key,
    value: ProductEditForm[Key],
  ) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input: AdminProductUpdateInput = {
      productName: form.productName.trim(),
      brand: form.brand.trim(),
      category: form.category,
      productDescription: form.productDescription.trim(),
      imageUrl: form.imageUrl.trim(),
      saleStatus: form.saleStatus,
      viscosity: form.viscosity.trim(),
      specification: form.specification.trim(),
      volume: form.volume.trim(),
      price: toNumber(form.price),
      stock: Math.max(0, Math.floor(toNumber(form.stock))),
      pointRewardRatePercent: toNumber(form.pointRewardRatePercent),
      mainProduct: form.mainProduct,
      recommended: form.recommended,
    };

    if (form.discountPrice.trim()) {
      input.discountPrice = toNumber(form.discountPrice);
    }

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId: product.productId,
        input,
      });
      setForm(toForm(updatedProduct));
      setMessage("상품 정보가 저장되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상품 저장에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
            <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-[#d6a84f]">BASIC</p>
                  <h2 className="mt-2 text-xl font-black text-white">상품 기본 정보</h2>
                </div>
                <p className="text-xs font-bold text-zinc-500">상품 번호 #{product.productId}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClassName}>
                  상품명
                  <input
                    value={form.productName}
                    onChange={(event) => updateForm("productName", event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  브랜드
                  <input
                    value={form.brand}
                    onChange={(event) => updateForm("brand", event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  카테고리
                  <select
                    value={form.category}
                    onChange={(event) => updateForm("category", event.target.value)}
                    className={inputClassName}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClassName}>
                  판매 상태
                  <select
                    value={form.saleStatus}
                    onChange={(event) => updateForm("saleStatus", event.target.value as ProductStatus)}
                    className={inputClassName}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {productStatusLabel[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={labelClassName}>
                상품 설명
                <textarea
                  value={form.productDescription}
                  onChange={(event) => updateForm("productDescription", event.target.value)}
                  className={textareaClassName}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-end">
                <label className={labelClassName}>
                  대표 이미지
                  <input
                    value={form.imageUrl}
                    onChange={(event) => updateForm("imageUrl", event.target.value)}
                    placeholder="/product-images/oil-bottle.svg"
                    className={inputClassName}
                  />
                </label>
                {form.imageUrl ? (
                  <div className="flex h-28 items-center justify-center rounded-md border border-white/10 bg-[#11100d]">
                    <Image
                      src={form.imageUrl}
                      alt=""
                      width={96}
                      height={96}
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
              <div>
                <p className="text-xs font-black text-[#d6a84f]">OIL SPEC</p>
                <h2 className="mt-2 text-xl font-black text-white">윤활유 정보</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className={labelClassName}>
                  점도
                  <input
                    value={form.viscosity}
                    onChange={(event) => updateForm("viscosity", event.target.value)}
                    placeholder="5W-30"
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  규격
                  <input
                    value={form.specification}
                    onChange={(event) => updateForm("specification", event.target.value)}
                    placeholder="API SP / ACEA C3"
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  용량
                  <input
                    value={form.volume}
                    onChange={(event) => updateForm("volume", event.target.value)}
                    placeholder="1L"
                    className={inputClassName}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
              <div>
                <p className="text-xs font-black text-[#d6a84f]">PRICE & STOCK</p>
                <h2 className="mt-2 text-xl font-black text-white">가격과 재고</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <label className={labelClassName}>
                  정상 판매가
                  <input
                    inputMode="numeric"
                    value={form.price}
                    onChange={(event) => updateForm("price", event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  할인 판매가
                  <input
                    inputMode="numeric"
                    value={form.discountPrice}
                    onChange={(event) => updateForm("discountPrice", event.target.value)}
                    placeholder="없으면 비워두기"
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  현재 재고
                  <input
                    inputMode="numeric"
                    value={form.stock}
                    onChange={(event) => updateForm("stock", event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  적립률
                  <input
                    inputMode="decimal"
                    value={form.pointRewardRatePercent}
                    onChange={(event) => updateForm("pointRewardRatePercent", event.target.value)}
                    className={inputClassName}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.mainProduct}
                    onChange={(event) => updateForm("mainProduct", event.target.checked)}
                  />
                  메인 상품
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.recommended}
                    onChange={(event) => updateForm("recommended", event.target.checked)}
                  />
                  추천 상품
                </label>
              </div>
            </section>

            {message ? (
              <p className="rounded-lg border border-white/10 bg-[#171611] p-4 text-sm font-bold text-zinc-300">
                {message}
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

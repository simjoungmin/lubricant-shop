"use client";

import { AdminProductEditForm } from "@/components/admin/product/edit/AdminProductEditForm";
import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminProduct } from "@/hooks/useAdminProducts";
import Link from "next/link";

type AdminProductEditContainerProps = {
  productId: number;
};

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

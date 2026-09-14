"use client";

import { AdminProductEditForm } from "@/components/admin/product/edit/AdminProductEditForm";
import { AdminGuardMessage } from "@/components/admin/AdminGuardMessage";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminProduct } from "@/hooks/useAdminProducts";
import Link from "next/link";

type AdminProductEditContainerProps = {
  productId: number;
};

export default function AdminProductEditContainer({
  productId,
}: AdminProductEditContainerProps) {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
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

        <AdminGuardMessage message={guardMessage} showLoginLink={showLoginLink} />

        {productQuery.data ? (
          <AdminProductEditForm key={productId} product={productQuery.data} />
        ) : null}
      </main>
    </>
  );
}

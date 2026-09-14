"use client";

import type { AdminProduct, ProductStatus } from "@/components/admin/admin.api";
import { AdminGuardMessage } from "@/components/admin/AdminGuardMessage";
import { AdminProductFilters } from "@/components/admin/product/AdminProductFilters";
import { AdminProductSummaryCards } from "@/components/admin/product/AdminProductSummaryCards";
import { AdminProductsTable } from "@/components/admin/product/AdminProductsTable";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminProductDrafts } from "@/hooks/useAdminProductDrafts";
import { useAdminProductFilters } from "@/hooks/useAdminProductFilters";
import { useAdminProducts, useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import Link from "next/link";
import { useMemo, useState } from "react";

const emptyProducts: AdminProduct[] = [];

export default function AdminProductsContainer() {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const [message, setMessage] = useState("");
  const productsQuery = useAdminProducts(isReady && isAdmin);
  const updateProductMutation = useUpdateAdminProduct();
  const products = productsQuery.data ?? emptyProducts;
  const { drafts, syncDraft, updateDraft } = useAdminProductDrafts(products);
  const {
    filteredProducts,
    keyword,
    selectedCategory,
    selectedStatus,
    setKeyword,
    setSelectedCategory,
    setSelectedStatus,
  } = useAdminProductFilters(products);

  const summary = useMemo(() => {
    const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 10).length;
    const soldOutCount = products.filter((product) => product.stock === 0 || product.saleStatus === "SOLD_OUT").length;
    const totalStock = products.reduce((total, product) => total + product.stock, 0);

    return { lowStockCount, soldOutCount, totalStock };
  }, [products]);

  const saveProduct = async (productId: number) => {
    const draft = drafts[productId];
    if (!draft) {
      return;
    }

    setMessage("");

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId,
        input: draft,
      });
      syncDraft(updatedProduct);
      setMessage(`${updatedProduct.productName} 재고가 저장되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "재고 저장에 실패했습니다.");
    }
  };

  const guardMessage = !isReady
    ? "관리자 정보를 확인하는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 재고를 관리할 수 있습니다."
      : productsQuery.isPending
        ? "재고 데이터를 불러오는 중입니다."
        : productsQuery.isError
          ? productsQuery.error.message
          : message || (products.length === 0 ? "등록된 상품이 없습니다." : "");

  return (
    <>
      <OilHeader />
      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1280px] px-6 py-10 lg:px-8">
        <AdminProductsHeader />

        {isReady && isAdmin ? (
          <AdminProductSummaryCards
            productCount={products.length}
            totalStock={summary.totalStock}
            lowStockCount={summary.lowStockCount}
            soldOutCount={summary.soldOutCount}
          />
        ) : null}

        <AdminGuardMessage message={guardMessage} showLoginLink={showLoginLink} className="mb-5" />

        {isReady && isAdmin ? (
          <>
            <AdminProductFilters
              keyword={keyword}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              onChangeKeyword={setKeyword}
              onChangeCategory={setSelectedCategory}
              onChangeStatus={(value) => setSelectedStatus(value as ProductStatus | "")}
            />
            <AdminProductsTable
              products={filteredProducts}
              drafts={drafts}
              isSaving={updateProductMutation.isPending}
              onUpdateDraft={updateDraft}
              onSaveProduct={saveProduct}
            />
          </>
        ) : null}
      </main>
    </>
  );
}

function AdminProductsHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <Link href="/admin" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
          관리자 홈
        </Link>
        <p className="mt-6 text-sm font-black text-[#d6a84f]">INVENTORY</p>
        <h1 className="mt-3 text-3xl font-black text-white">재고 관리</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          상품 목록을 확인하고 재고와 판매상태를 빠르게 관리합니다.
        </p>
      </div>
      <Link
        href="/admin/orders"
        className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
      >
        주문 관리로 이동
      </Link>
    </div>
  );
}

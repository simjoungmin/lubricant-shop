"use client";

import {
  type AdminProduct,
  type ProductStatus,
} from "@/components/admin/admin.api";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { formatPrice } from "@/components/cart/cart.utils";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminProducts, useUpdateAdminProduct } from "@/hooks/useAdminProducts";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const productStatusLabel: Record<ProductStatus, string> = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  STOPPED: "판매중지",
  HIDDEN: "임시 저장",
};

const categoryLabel: Record<string, string> = {
  engine: "엔진오일",
  mission: "미션오일",
  brake: "브레이크액",
  filter: "필터",
  gear: "기어 오일",
  chemical: "케미컬",
};

const statusOptions = Object.keys(productStatusLabel) as ProductStatus[];
const emptyProducts: AdminProduct[] = [];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

export default function AdminProductsContainer() {
  const { user, isReady } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [drafts, setDrafts] = useState<Record<number, { stock: number; saleStatus: ProductStatus }>>({});
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const productsQuery = useAdminProducts(isReady && isAdmin);
  const updateProductMutation = useUpdateAdminProduct();
  const products = productsQuery.data ?? emptyProducts;

  const summary = useMemo(() => {
    const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 10).length;
    const soldOutCount = products.filter((product) => product.stock === 0 || product.saleStatus === "SOLD_OUT").length;
    const totalStock = products.reduce((total, product) => total + product.stock, 0);

    return { lowStockCount, soldOutCount, totalStock };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const isMatchedKeyword = !normalizedKeyword
        || String(product.productId).includes(normalizedKeyword)
        || product.productName.toLowerCase().includes(normalizedKeyword)
        || product.brand.toLowerCase().includes(normalizedKeyword);
      const isMatchedCategory = !selectedCategory || product.category === selectedCategory;
      const isMatchedStatus = !selectedStatus || product.saleStatus === selectedStatus;

      return isMatchedKeyword && isMatchedCategory && isMatchedStatus;
    });
  }, [keyword, products, selectedCategory, selectedStatus]);

  const updateDraft = (productId: number, nextDraft: Partial<{ stock: number; saleStatus: ProductStatus }>) => {
    setDrafts((prevDrafts) => ({
      ...prevDrafts,
      [productId]: {
        ...prevDrafts[productId],
        ...nextDraft,
      },
    }));
  };

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
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [productId]: {
          stock: updatedProduct.stock,
          saleStatus: updatedProduct.saleStatus,
        },
      }));
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

        {isReady && isAdmin ? (
          <section className="mb-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">등록 상품</p>
              <p className="mt-2 text-2xl font-black text-white">{products.length}개</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">전체 재고</p>
              <p className="mt-2 text-2xl font-black text-white">{summary.totalStock.toLocaleString("ko-KR")}개</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">재고 주의</p>
              <p className="mt-2 text-2xl font-black text-[#d6a84f]">{summary.lowStockCount}개</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#171611] p-4">
              <p className="text-xs font-bold text-zinc-500">품절/품절예정</p>
              <p className="mt-2 text-2xl font-black text-red-400">{summary.soldOutCount}개</p>
            </div>
          </section>
        ) : null}

        {guardMessage ? (
          <section className="mb-5 rounded-lg border border-white/10 bg-[#171611] p-5">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
            {isReady && !isAdmin ? (
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
              >
                로그인하러 가기
              </Link>
            ) : null}
          </section>
        ) : null}

        {isReady && isAdmin ? (
          <section className="mb-5 grid gap-3 rounded-lg border border-white/10 bg-[#171611] p-4 md:grid-cols-[1fr_180px_180px]">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="상품명, 상품 번호, 브랜드 검색"
              className="h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]"
            />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition focus:border-[#d6a84f]"
            >
              <option value="">카테고리 전체</option>
              {Object.entries(categoryLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition focus:border-[#d6a84f]"
            >
              <option value="">판매 상태 전체</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {productStatusLabel[status]}
                </option>
              ))}
            </select>
          </section>
        ) : null}

        {isReady && isAdmin ? (
          <section className="overflow-hidden rounded-lg border border-white/10 bg-[#171611]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                <thead className="bg-black/30 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">번호</th>
                    <th className="px-4 py-3">상품</th>
                    <th className="px-4 py-3">카테고리</th>
                    <th className="px-4 py-3">가격</th>
                    <th className="px-4 py-3">재고</th>
                    <th className="px-4 py-3">판매상태</th>
                    <th className="px-4 py-3">수정일</th>
                    <th className="px-4 py-3">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredProducts.map((product) => {
                    const draft = drafts[product.productId] ?? {
                      stock: product.stock,
                      saleStatus: product.saleStatus,
                    };
                    const isChanged =
                      draft.stock !== product.stock || draft.saleStatus !== product.saleStatus;
                    const isLowStock = product.stock > 0 && product.stock <= 10;

                    return (
                      <tr key={product.productId} className="align-middle">
                        <td className="px-4 py-4 font-black text-zinc-400">
                          #{product.productId}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.imageUrl}
                              alt=""
                              width={64}
                              height={64}
                              className="h-16 w-16 rounded-md bg-white object-cover"
                            />
                            <div>
                              <p className="font-black text-white">{product.productName}</p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {product.brand} · {product.specification || "규격 정보 없음"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-zinc-300">
                          {categoryLabel[product.category] ?? product.category}
                        </td>
                        <td className="px-4 py-4 font-black text-[#d6a84f]">
                          {formatPrice(product.discountPrice ?? product.price)}
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min={0}
                            value={draft.stock}
                            onChange={(event) =>
                              updateDraft(product.productId, {
                                stock: Math.max(0, Number(event.target.value)),
                              })
                            }
                            className={`h-10 w-24 rounded-md border bg-[#11100d] px-3 font-bold text-white outline-none focus:border-[#d6a84f] ${
                              isLowStock ? "border-[#d6a84f]" : "border-white/10"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={draft.saleStatus}
                            onChange={(event) =>
                              updateDraft(product.productId, {
                                saleStatus: event.target.value as ProductStatus,
                              })
                            }
                            className="h-10 rounded-md border border-white/10 bg-[#11100d] px-3 font-bold text-white outline-none focus:border-[#d6a84f]"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {productStatusLabel[status]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-zinc-300">{formatDate(product.updatedAt)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/products/${product.productId}/edit`}
                              className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
                            >
                              수정
                            </Link>
                          <button
                            type="button"
                            disabled={!isChanged || updateProductMutation.isPending}
                            onClick={() => saveProduct(product.productId)}
                            className="h-10 rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                          >
                            {updateProductMutation.isPending ? "저장 중" : "저장"}
                          </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}

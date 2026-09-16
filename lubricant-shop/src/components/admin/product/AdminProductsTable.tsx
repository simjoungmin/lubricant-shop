import type { AdminProduct, ProductStatus } from "@/components/admin/admin.api";
import {
  adminProductCategoryLabel,
  adminProductStatusLabel,
  adminProductStatusOptions,
  formatAdminProductDate,
} from "@/components/admin/product/admin-product.labels";
import { formatPrice } from "@/components/cart/cart.utils";
import { ProductImage, PRODUCT_IMAGE_SIZES } from "@/components/common/ProductImage";
import Link from "next/link";

export type AdminProductDraft = {
  stock: number;
  saleStatus: ProductStatus;
};

type AdminProductsTableProps = {
  products: AdminProduct[];
  drafts: Record<number, AdminProductDraft>;
  isSaving: boolean;
  onUpdateDraft: (productId: number, nextDraft: Partial<AdminProductDraft>) => void;
  onSaveProduct: (productId: number) => void;
};

export function AdminProductsTable({
  products,
  drafts,
  isSaving,
  onUpdateDraft,
  onSaveProduct,
}: AdminProductsTableProps) {
  return (
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
            {products.length > 0 ? (
              products.map((product) => (
                <AdminProductRow
                  key={product.productId}
                  product={product}
                  draft={drafts[product.productId] ?? {
                    stock: product.stock,
                    saleStatus: product.saleStatus,
                  }}
                  isSaving={isSaving}
                  onUpdateDraft={onUpdateDraft}
                  onSaveProduct={onSaveProduct}
                />
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center font-bold text-zinc-400" colSpan={8}>
                  조건에 맞는 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminProductRow({
  product,
  draft,
  isSaving,
  onUpdateDraft,
  onSaveProduct,
}: {
  product: AdminProduct;
  draft: AdminProductDraft;
  isSaving: boolean;
  onUpdateDraft: (productId: number, nextDraft: Partial<AdminProductDraft>) => void;
  onSaveProduct: (productId: number) => void;
}) {
  const isChanged = draft.stock !== product.stock || draft.saleStatus !== product.saleStatus;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <tr className="align-middle">
      <td className="px-4 py-4 font-black text-zinc-400">#{product.productId}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
            <ProductImage
              src={product.imageUrl}
              alt={`${product.productName} 상품 이미지`}
              sizes={PRODUCT_IMAGE_SIZES.thumbnail}
              className="object-contain p-2"
            />
          </div>
          <div>
            <p className="font-black text-white">{product.productName}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {product.brand} · {product.specification || "규격 정보 없음"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-zinc-300">
        {adminProductCategoryLabel[product.category] ?? product.category}
      </td>
      <td className="px-4 py-4 font-black text-[#d6a84f]">
        {formatPrice(product.discountPrice ?? product.price)}
      </td>
      <td className="px-4 py-4">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft.stock}
          onChange={(event) => {
            const nextStock = Number.parseInt(event.target.value, 10);

            onUpdateDraft(product.productId, {
              stock: Number.isFinite(nextStock) ? Math.max(0, nextStock) : 0,
              saleStatus: draft.saleStatus,
            });
          }}
          className={`h-10 w-24 rounded-md border bg-[#11100d] px-3 font-bold text-white outline-none focus:border-[#d6a84f] ${
            isLowStock ? "border-[#d6a84f]" : "border-white/10"
          }`}
        />
      </td>
      <td className="px-4 py-4">
        <select
          value={draft.saleStatus}
          onChange={(event) =>
            onUpdateDraft(product.productId, {
              stock: draft.stock,
              saleStatus: event.target.value as ProductStatus,
            })
          }
          className="h-10 rounded-md border border-white/10 bg-[#11100d] px-3 font-bold text-white outline-none focus:border-[#d6a84f]"
        >
          {adminProductStatusOptions.map((status) => (
            <option key={status} value={status}>
              {adminProductStatusLabel[status]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-4">
        <p className="font-bold text-zinc-300">{formatAdminProductDate(product.updatedAt)}</p>
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
            disabled={!isChanged || isSaving}
            onClick={() => onSaveProduct(product.productId)}
            className="h-10 rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isSaving ? "저장 중" : "저장"}
          </button>
        </div>
      </td>
    </tr>
  );
}

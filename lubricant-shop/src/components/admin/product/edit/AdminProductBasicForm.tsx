import type { ProductStatus } from "@/components/admin/admin.api";
import {
  adminProductCategoryLabel,
  adminProductStatusLabel,
  adminProductStatusOptions,
} from "@/components/admin/product/admin-product.labels";
import {
  type ProductEditForm,
  type ProductEditFormChangeHandler,
  productEditInputClassName,
  productEditLabelClassName,
  productEditTextareaClassName,
} from "@/components/admin/product/edit/admin-product-edit.types";
import Image from "next/image";

type AdminProductBasicFormProps = {
  productId: number;
  form: ProductEditForm;
  onChange: ProductEditFormChangeHandler;
};

export function AdminProductBasicForm({
  productId,
  form,
  onChange,
}: AdminProductBasicFormProps) {
  return (
    <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black text-[#d6a84f]">BASIC</p>
          <h2 className="mt-2 text-xl font-black text-white">상품 기본 정보</h2>
        </div>
        <p className="text-xs font-bold text-zinc-500">상품 번호 #{productId}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProductInput
          label="상품명"
          value={form.productName}
          onChange={(value) => onChange("productName", value)}
        />
        <ProductInput
          label="브랜드"
          value={form.brand}
          onChange={(value) => onChange("brand", value)}
        />
        <label className={productEditLabelClassName}>
          카테고리
          <select
            value={form.category}
            onChange={(event) => onChange("category", event.target.value)}
            className={productEditInputClassName}
          >
            {Object.entries(adminProductCategoryLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={productEditLabelClassName}>
          판매 상태
          <select
            value={form.saleStatus}
            onChange={(event) => onChange("saleStatus", event.target.value as ProductStatus)}
            className={productEditInputClassName}
          >
            {adminProductStatusOptions.map((status) => (
              <option key={status} value={status}>
                {adminProductStatusLabel[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={productEditLabelClassName}>
        상품 설명
        <textarea
          value={form.productDescription}
          onChange={(event) => onChange("productDescription", event.target.value)}
          className={productEditTextareaClassName}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-end">
        <ProductInput
          label="대표 이미지"
          value={form.imageUrl}
          placeholder="/product-images/oil-bottle.svg"
          onChange={(value) => onChange("imageUrl", value)}
        />
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
  );
}

function ProductInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={productEditLabelClassName}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={productEditInputClassName}
      />
    </label>
  );
}

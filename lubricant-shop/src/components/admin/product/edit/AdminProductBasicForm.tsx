import { categories } from "@/assets/category/categories";
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
import { ProductImage, PRODUCT_IMAGE_SIZES } from "@/components/common/ProductImage";

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
  const selectedCategory = categories.find((category) => category.slug === form.category);
  const handleToggleSubCategory = (subCategorySlug: string) => {
    const nextSubCategories = form.subCategories.includes(subCategorySlug)
      ? form.subCategories.filter((currentSlug) => currentSlug !== subCategorySlug)
      : [...form.subCategories, subCategorySlug];

    onChange("subCategories", nextSubCategories);
    onChange("subCategory", nextSubCategories[0] ?? "");
  };

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
            onChange={(event) => {
              onChange("category", event.target.value);
              onChange("subCategory", "");
              onChange("subCategories", []);
            }}
            className={productEditInputClassName}
          >
            {Object.entries(adminProductCategoryLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="grid gap-2 text-xs font-black text-zinc-500 md:col-span-2">
          <legend>하위 카테고리</legend>
          <div className="grid gap-2 rounded-md border border-white/10 bg-[#11100d] p-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedCategory?.subCategories.map((subCategory) => {
              const isChecked = form.subCategories.includes(subCategory.slug);

              return (
                <label
                  key={subCategory.slug}
                  className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-bold text-white transition hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSubCategory(subCategory.slug)}
                    className="h-4 w-4 accent-[#d6a84f]"
                  />
                  {subCategory.label}
                </label>
              );
            })}
          </div>
        </fieldset>
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
          placeholder="/product-images/sample.jpeg 또는 https://cdn.example.com/sample.webp"
          onChange={(value) => onChange("imageUrl", value)}
        />
        <div className="relative h-28 overflow-hidden rounded-md border border-white/10 bg-[#11100d]">
          <ProductImage
            src={form.imageUrl}
            alt="대표 이미지 미리보기"
            sizes={PRODUCT_IMAGE_SIZES.adminPreview}
            className="object-contain p-3"
          />
        </div>
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

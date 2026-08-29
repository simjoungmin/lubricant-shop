import {
  adminProductCategoryLabel,
  adminProductStatusLabel,
  adminProductStatusOptions,
} from "@/components/admin/product/admin-product.labels";

type AdminProductFiltersProps = {
  keyword: string;
  selectedCategory: string;
  selectedStatus: string;
  onChangeKeyword: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeStatus: (value: string) => void;
};

const inputClassName =
  "h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";

export function AdminProductFilters({
  keyword,
  selectedCategory,
  selectedStatus,
  onChangeKeyword,
  onChangeCategory,
  onChangeStatus,
}: AdminProductFiltersProps) {
  return (
    <section className="mb-5 grid gap-3 rounded-lg border border-white/10 bg-[#171611] p-4 md:grid-cols-[1fr_180px_180px]">
      <input
        value={keyword}
        onChange={(event) => onChangeKeyword(event.target.value)}
        placeholder="상품명, 상품 번호, 브랜드 검색"
        className={inputClassName}
      />
      <select
        value={selectedCategory}
        onChange={(event) => onChangeCategory(event.target.value)}
        className={inputClassName}
      >
        <option value="">카테고리 전체</option>
        {Object.entries(adminProductCategoryLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(event) => onChangeStatus(event.target.value)}
        className={inputClassName}
      >
        <option value="">판매 상태 전체</option>
        {adminProductStatusOptions.map((status) => (
          <option key={status} value={status}>
            {adminProductStatusLabel[status]}
          </option>
        ))}
      </select>
    </section>
  );
}

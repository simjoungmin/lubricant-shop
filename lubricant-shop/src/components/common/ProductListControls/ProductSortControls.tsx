"use client";

import type { ProductControlOption } from "./productFilterOptions";

type ProductSortControlsProps = {
  totalCount: number;
  hasSearchFilter: boolean;
  selectedSort: string;
  selectedPageSize: string;
  showPageSize: boolean;
  sortOptions: ProductControlOption[];
  pageSizeOptions: ProductControlOption[];
  onClearSearch: () => void;
  onUpdateSearchParam: (key: "sort" | "pageSize", value: string) => void;
};

const selectClassName =
  "h-10 rounded-md border border-white/10 bg-[#171511] px-3 text-sm font-bold text-zinc-300 outline-none transition focus:border-[#d6a84f]";

const ProductSortControls = ({
  totalCount,
  hasSearchFilter,
  selectedSort,
  selectedPageSize,
  showPageSize,
  sortOptions,
  pageSizeOptions,
  onClearSearch,
  onUpdateSearchParam,
}: ProductSortControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <span>총 {totalCount}개 상품</span>
      {hasSearchFilter ? (
        <button
          type="button"
          className="h-10 rounded-md border border-white/10 px-3 font-black text-zinc-300 transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
          onClick={onClearSearch}
        >
          필터 초기화
        </button>
      ) : null}
      <select
        aria-label="상품 정렬"
        className={selectClassName}
        value={selectedSort}
        onChange={(event) => onUpdateSearchParam("sort", event.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showPageSize ? (
        <select
          aria-label="상품 표시 개수"
          className={selectClassName}
          value={selectedPageSize}
          onChange={(event) =>
            onUpdateSearchParam("pageSize", event.target.value)
          }
        >
          {pageSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
};

export default ProductSortControls;

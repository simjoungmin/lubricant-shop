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
  "h-10 rounded-md border border-[#dce2e8] bg-white px-3 text-sm font-bold text-[#071d3b] outline-none transition focus:border-[#071d3b]";

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
    <div className="flex flex-wrap items-center justify-end gap-3 text-[#65717f]">
      <span className="font-semibold">총 {totalCount}개 상품</span>
      {hasSearchFilter ? (
        <button
          type="button"
          className="h-10 rounded-md border border-[#dce2e8] bg-white px-3 font-black text-[#34465c] transition hover:border-[#ff8a65] hover:text-[#ff4b1f]"
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

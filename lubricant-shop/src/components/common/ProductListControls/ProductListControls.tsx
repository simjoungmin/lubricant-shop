"use client";

import ProductSearchForm from "./ProductSearchForm";
import ProductSortControls from "./ProductSortControls";
import {
  defaultPageSizeOptions,
  defaultSortOptions,
  type ProductControlOption,
} from "./productFilterOptions";
import { useProductListParams } from "./useProductListParams";

type ProductListControlsProps = {
  totalCount: number;
  showPageSize?: boolean;
  sortOptions?: ProductControlOption[];
  pageSizeOptions?: ProductControlOption[];
};

const ProductListControls = ({
  totalCount,
  showPageSize = true,
  sortOptions = defaultSortOptions,
  pageSizeOptions = defaultPageSizeOptions,
}: ProductListControlsProps) => {
  const {
    currentFilters,
    hasSearchFilter,
    selectedPageSize,
    selectedSort,
    updateSearchParam,
    updateSearchFilters,
    clearSearchFilters,
  } = useProductListParams({ sortOptions, pageSizeOptions });

  return (
    <div className="grid w-full gap-3 text-xs text-zinc-400 md:w-auto md:min-w-[640px]">
      <ProductSearchForm
        currentFilters={currentFilters}
        onSubmit={updateSearchFilters}
      />
      <ProductSortControls
        totalCount={totalCount}
        hasSearchFilter={hasSearchFilter}
        selectedSort={selectedSort}
        selectedPageSize={selectedPageSize}
        showPageSize={showPageSize}
        sortOptions={sortOptions}
        pageSizeOptions={pageSizeOptions}
        onClearSearch={clearSearchFilters}
        onUpdateSearchParam={updateSearchParam}
      />
    </div>
  );
};

export default ProductListControls;

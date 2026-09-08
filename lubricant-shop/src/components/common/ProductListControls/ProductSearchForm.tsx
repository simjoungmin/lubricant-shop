"use client";

import type { FormEvent } from "react";
import {
  fuelTypeOptions,
  standardOptions,
  viscosityOptions,
} from "./productFilterOptions";
import type { ProductFilterValues } from "./useProductListParams";

type ProductSearchFormProps = {
  currentFilters: ProductFilterValues;
  onSubmit: (filters: ProductFilterValues) => void;
};

const selectClassName =
  "h-10 rounded-md border border-[#dce2e8] bg-white px-3 text-sm font-bold text-[#071d3b] outline-none transition focus:border-[#071d3b]";

const searchInputClassName =
  "h-10 min-w-0 rounded-md border border-[#dce2e8] bg-white px-3 text-sm font-bold text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b]";

const ProductSearchForm = ({
  currentFilters,
  onSubmit,
}: ProductSearchFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      q: String(formData.get("q") ?? "").trim(),
      fuelType: String(formData.get("fuelType") ?? ""),
      viscosity: String(formData.get("viscosity") ?? ""),
      standard: String(formData.get("standard") ?? ""),
    });
  };

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="product-search">
        상품 검색
      </label>
      <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
        <input
          key={currentFilters.q}
          id="product-search"
          name="q"
          className={searchInputClassName}
          placeholder="상품명 또는 규격 검색"
          defaultValue={currentFilters.q}
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-[#071d3b] px-4 font-black text-white transition hover:bg-[#12345f]"
        >
          검색
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          key={`fuel-${currentFilters.fuelType}`}
          name="fuelType"
          aria-label="연료 또는 차종 선택"
          className={selectClassName}
          defaultValue={currentFilters.fuelType}
        >
          {fuelTypeOptions.map((option) => (
            <option key={option.value || "all-fuel"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          key={`viscosity-${currentFilters.viscosity}`}
          name="viscosity"
          aria-label="점도 선택"
          className={selectClassName}
          defaultValue={currentFilters.viscosity}
        >
          {viscosityOptions.map((option) => (
            <option key={option.value || "all-viscosity"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          key={`standard-${currentFilters.standard}`}
          name="standard"
          aria-label="규격 선택"
          className={selectClassName}
          defaultValue={currentFilters.standard}
        >
          {standardOptions.map((option) => (
            <option key={option.value || "all-standard"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default ProductSearchForm;

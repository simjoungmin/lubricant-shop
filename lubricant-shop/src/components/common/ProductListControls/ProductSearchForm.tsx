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
  "h-10 rounded-md border border-white/10 bg-[#171511] px-3 text-sm font-bold text-zinc-300 outline-none transition focus:border-[#d6a84f]";

const searchInputClassName =
  "h-10 min-w-0 rounded-md border border-white/10 bg-[#171511] px-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]";

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
          className="h-10 rounded-md bg-[#d6a84f] px-4 font-black text-black transition hover:bg-[#f0c76a]"
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

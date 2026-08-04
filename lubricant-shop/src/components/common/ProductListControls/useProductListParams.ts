"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductControlOption } from "./productFilterOptions";

export type ProductFilterValues = {
  q: string;
  fuelType: string;
  viscosity: string;
  standard: string;
};

type ProductListParamConfig = {
  sortOptions: ProductControlOption[];
  pageSizeOptions: ProductControlOption[];
};

const filterKeys = ["q", "fuelType", "viscosity", "standard"] as const;

const setOrDeleteParam = (
  params: URLSearchParams,
  key: string,
  value: string,
) => {
  if (value) {
    params.set(key, value);
    return;
  }

  params.delete(key);
};

export const useProductListParams = ({
  sortOptions,
  pageSizeOptions,
}: ProductListParamConfig) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSort = searchParams.get("sort") ?? sortOptions[0].value;
  const selectedPageSize =
    searchParams.get("pageSize") ?? pageSizeOptions[0].value;
  const currentFilters: ProductFilterValues = {
    q: searchParams.get("q") ?? "",
    fuelType: searchParams.get("fuelType") ?? "",
    viscosity: searchParams.get("viscosity") ?? "",
    standard: searchParams.get("standard") ?? "",
  };
  const hasSearchFilter = filterKeys.some((key) => Boolean(currentFilters[key]));

  const replaceWithParams = (params: URLSearchParams) => {
    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const updateSearchParam = (key: "sort" | "pageSize", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    if (key === "sort") {
      params.delete("pageSize");
    }

    replaceWithParams(params);
  };

  const updateSearchFilters = (filters: ProductFilterValues) => {
    const params = new URLSearchParams(searchParams.toString());

    filterKeys.forEach((key) => {
      setOrDeleteParam(params, key, filters[key].trim());
    });

    params.delete("pageSize");
    replaceWithParams(params);
  };

  const clearSearchFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    filterKeys.forEach((key) => params.delete(key));
    params.delete("pageSize");
    replaceWithParams(params);
  };

  return {
    currentFilters,
    hasSearchFilter,
    selectedPageSize,
    selectedSort,
    updateSearchParam,
    updateSearchFilters,
    clearSearchFilters,
  };
};

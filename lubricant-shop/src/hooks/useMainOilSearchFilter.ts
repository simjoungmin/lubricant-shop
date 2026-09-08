"use client";

import type { CategorySlug } from "@/assets/category/types";
import type { MainOilSearchFilterState } from "@/types/oil-search-filter.types";
import {
  getMainOilSearchRoute,
  getMainOilSubCategoryOptions,
} from "@/utils/oilSearchFilter.utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const initialState: MainOilSearchFilterState = {
  categorySlug: "",
  subCategorySlug: "",
  keyword: "",
};

export const useMainOilSearchFilter = () => {
  const router = useRouter();
  const [filterState, setFilterState] = useState(initialState);

  const subCategoryOptions = useMemo(
    () => getMainOilSubCategoryOptions(filterState.categorySlug),
    [filterState.categorySlug],
  );

  const hasCategoryFilter = Boolean(filterState.categorySlug && filterState.subCategorySlug);
  const hasKeywordFilter = Boolean(filterState.keyword.trim());
  const canSearch = hasCategoryFilter || hasKeywordFilter;

  const handleChangeCategory = (categorySlug: string) => {
    setFilterState((currentState) => ({
      ...currentState,
      categorySlug: categorySlug as CategorySlug,
      subCategorySlug: "",
    }));
  };

  const handleChangeSubCategory = (subCategorySlug: string) => {
    setFilterState((currentState) => ({
      ...currentState,
      subCategorySlug,
    }));
  };

  const handleChangeKeyword = (keyword: string) => {
    setFilterState((currentState) => ({
      ...currentState,
      keyword,
    }));
  };

  const handleSearch = () => {
    if (!canSearch) {
      return;
    }

    router.push(
      getMainOilSearchRoute(
        filterState.categorySlug,
        filterState.subCategorySlug,
        filterState.keyword,
      ),
    );
  };

  return {
    canSearch,
    filterState,
    subCategoryOptions,
    handleChangeCategory,
    handleChangeSubCategory,
    handleChangeKeyword,
    handleSearch,
  };
};

"use client";

import { useMainOilSearchFilter } from "@/hooks/useMainOilSearchFilter";
import { getMainOilCategoryOptions } from "@/utils/oilSearchFilter.utils";
import type { ChangeEvent, FormEvent } from "react";

const categoryOptions = getMainOilCategoryOptions();

const fieldClassName =
  "h-12 rounded border border-[#dce2e8] bg-white px-4 text-sm font-semibold text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#071d3b] disabled:cursor-not-allowed disabled:bg-[#f5f7f9] disabled:text-[#a4adb8]";

const MainOilSearchFilter = () => {
  const {
    canSearch,
    filterState,
    subCategoryOptions,
    handleChangeCategory,
    handleChangeSubCategory,
    handleChangeKeyword,
    handleSearch,
  } = useMainOilSearchFilter();

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleChangeCategory(event.target.value);
  };

  const handleSubCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleChangeSubCategory(event.target.value);
  };

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChangeKeyword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <form
      className="-mt-14 rounded-lg border border-[#e2e6eb] bg-white p-7 shadow-[0_18px_36px_rgba(7,29,59,0.08)]"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-5 text-xl font-black">내 차에 맞는 오일 찾기</h2>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_140px]">
        <label className="sr-only" htmlFor="main-oil-category">
          카테고리 선택
        </label>
        <select
          id="main-oil-category"
          className={fieldClassName}
          value={filterState.categorySlug}
          onChange={handleCategoryChange}
        >
          <option value="">카테고리 선택</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="main-oil-sub-category">
          세부 분류 선택
        </label>
        <select
          id="main-oil-sub-category"
          className={fieldClassName}
          value={filterState.subCategorySlug}
          disabled={!filterState.categorySlug}
          onChange={handleSubCategoryChange}
        >
          <option value="">세부 분류 선택</option>
          {subCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="main-oil-keyword">
          제품명 검색
        </label>
        <input
          id="main-oil-keyword"
          type="search"
          className={fieldClassName}
          placeholder="제품명 검색"
          value={filterState.keyword}
          onChange={handleKeywordChange}
        />

        <button
          type="submit"
          className="h-12 rounded bg-[#071d3b] text-sm font-black text-white transition hover:bg-[#12345f] disabled:cursor-not-allowed disabled:bg-[#b9c1ca]"
          disabled={!canSearch}
        >
          오일 검색
        </button>
      </div>
    </form>
  );
};

export default MainOilSearchFilter;

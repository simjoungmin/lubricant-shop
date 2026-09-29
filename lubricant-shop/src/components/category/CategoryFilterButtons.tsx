"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";

type CategoryFilterButtonsProps = {
  items: string[];
  selectedValue: string;
  queryKey: "brand" | "viscosity";
};

type FilterButtonColor = {
  background: string;
  ring: string;
  text: string;
};

const defaultFilterButtonColor: FilterButtonColor = {
  background: "#F0F2F5",
  ring: "#D7DCE3",
  text: "#071D3B",
};

const normalizeFilterValue = (value: string) => {
  return value
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll("/", "");
};

const getButtonStyle = (isSelected: boolean): CSSProperties => {
  return {
    backgroundColor: defaultFilterButtonColor.background,
    color: defaultFilterButtonColor.text,
    boxShadow: isSelected
      ? `0 0 0 3px ${defaultFilterButtonColor.ring}33, 0 10px 18px ${defaultFilterButtonColor.ring}22`
      : undefined,
  };
};

const CategoryFilterButtons = ({
  items,
  selectedValue,
  queryKey,
}: CategoryFilterButtonsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const normalizedSelectedValue = normalizeFilterValue(selectedValue);

  if (items.length === 0) {
    return null;
  }

  const createHref = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isSelected =
      normalizeFilterValue(item) === normalizedSelectedValue;

    if (isSelected) {
      params.delete(queryKey);
    } else {
      params.set(queryKey, item);
    }

    params.delete("pageSize");

    const queryString = params.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  return (
    <div className="mb-6 rounded-lg bg-white px-4 py-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
        {items.map((item) => {
          const isSelected =
            normalizeFilterValue(item) === normalizedSelectedValue;

          return (
            <Link
              key={item}
              href={createHref(item)}
              style={getButtonStyle(isSelected)}
              className={`flex h-9 items-center justify-center rounded-full px-4 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-95 ${
                isSelected
                  ? "ring-2 ring-white"
                  : "shadow-sm hover:shadow-md"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterButtons;

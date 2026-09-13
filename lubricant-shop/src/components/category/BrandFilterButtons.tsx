"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type BrandFilterButtonsProps = {
  brands: string[];
  selectedBrand: string;
};

const BrandFilterButtons = ({
  brands,
  selectedBrand,
}: BrandFilterButtonsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (brands.length === 0) {
    return null;
  }

  const createHref = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (brand === selectedBrand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }

    params.delete("pageSize");

    const queryString = params.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  return (
    <div className="mb-6 rounded-lg bg-[#eef1f4] px-4 py-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {brands.map((brand) => {
          const isSelected = brand === selectedBrand;

          return (
            <Link
              key={brand}
              href={createHref(brand)}
              className={`flex h-9 items-center justify-center rounded-full px-4 text-sm font-bold transition ${
                isSelected
                  ? "bg-[#071d3b] text-white shadow-sm"
                  : "bg-white text-[#5b6673] hover:bg-[#fff3ef] hover:text-[#ff4b1f]"
              }`}
            >
              {brand}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BrandFilterButtons;

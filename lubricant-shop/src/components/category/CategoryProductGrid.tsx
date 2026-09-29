import type { Product } from "@/assets/category/types";
import React from "react";
import BrandFilterButtons from "./BrandFilterButtons";
import CategoryProductCard from "./CategoryProductCard";
import ViscosityFilterButtons from "./ViscosityFilterButtons";

type CategoryProductGridProps = {
  products: Product[];
  brandOptions?: string[];
  selectedBrand?: string;
  viscosityOptions?: string[];
  selectedViscosity?: string;
};

const CategoryProductGrid = ({
  products,
  brandOptions = [],
  selectedBrand = "",
  viscosityOptions = [],
  selectedViscosity = "",
}: CategoryProductGridProps) => {
  return (
    <>
      <BrandFilterButtons brands={brandOptions} selectedBrand={selectedBrand} />
      <ViscosityFilterButtons
        viscosities={viscosityOptions}
        selectedViscosity={selectedViscosity}
      />

      {products.length === 0 ? (
        <div className="rounded-lg border border-[#dde2e8] bg-white px-6 py-16 text-center text-sm font-semibold text-[#65717f]">
          준비된 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default CategoryProductGrid;

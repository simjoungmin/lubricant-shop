import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import BrandSection from "@/components/main/BrandSection";
import CategorySection from "@/components/main/CategorySection";
import HeroSection from "@/components/main/HeroSection";
import OilGuideSection from "@/components/main/OilGuideSection";
import ProductSection from "@/components/main/ProductSection";
import ShortClipSection from "@/components/main/ShortClipSection";
import { productApi } from "@/components/category/product.api";
import React from "react";


const MainpageContainer = async () => {
  const products = await productApi.findProducts({ sort: "popular" });
  const hotProducts = products.slice(0, 5);
  const bestProducts = products.slice(5, 10).length > 0
    ? products.slice(5, 10)
    : products.slice(0, 5);

  return (
    <>
      <OilHeader />

      <main>
        <HeroSection />
        <CategorySection />

        <ProductSection title="HOT 상품" badge="HOT" products={hotProducts} />
        <ProductSection title="BEST 상품" badge="BEST" products={bestProducts} />

        <OilGuideSection />
        <ShortClipSection />
        <BrandSection />
      </main>

      <OilFooter />
    </>
  );
};

export default MainpageContainer;

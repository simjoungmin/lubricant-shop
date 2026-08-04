import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import BrandSection from "@/components/main/BrandSection";
import CategorySection from "@/components/main/CategorySection";
import HeroSection from "@/components/main/HeroSection";
import OilGuideSection from "@/components/main/OilGuideSection";
import ProductSection from "@/components/main/ProductSection";
import ShortClipSection from "@/components/main/ShortClipSection";
import React from "react";


const MainpageContainer = () => {
  return (
    <>
      <OilHeader />

      <main>
        <HeroSection />
        <CategorySection />

        <ProductSection title="HOT 상품" badge="HOT" />
        <ProductSection title="BEST 상품" badge="BEST" />

        <OilGuideSection />
        <ShortClipSection />
        <BrandSection />
      </main>

      <OilFooter />
    </>
  );
};

export default MainpageContainer;
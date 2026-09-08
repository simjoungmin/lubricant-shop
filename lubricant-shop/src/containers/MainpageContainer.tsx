import OilFooter from "@/components/layout/OilFooter";
import OilHeader from "@/components/layout/OilHeader";
import { ToastNotice } from "@/components/common/ToastNotice";
import BrandSection from "@/components/main/BrandSection";
import CategorySection from "@/components/main/CategorySection";
import HeroSection from "@/components/main/HeroSection";
import ProductSection from "@/components/main/ProductSection";
import ServiceBannerSection from "@/components/main/ServiceBannerSection";
import ShortClipSection from "@/components/main/ShortClipSection";
import { displayApi } from "@/components/main/display.api";
import React from "react";

type MainpageContainerProps = {
  shouldShowInquiryToast?: boolean;
};

const MainpageContainer = async ({ shouldShowInquiryToast = false }: MainpageContainerProps) => {
  const displaySections = await displayApi.findSections();

  return (
    <>
      <OilHeader />
      {shouldShowInquiryToast ? <ToastNotice message="문의가 접수되었습니다" /> : null}

      <main className="bg-[#f7f7f5]">
        <HeroSection />
        <CategorySection />

        {displaySections.map((section) => (
          <ProductSection
            key={section.sectionId}
            title={section.sectionName}
            badge={section.sectionCode}
            products={section.products}
          />
        ))}
        <ServiceBannerSection />

        <ShortClipSection />
        <BrandSection />
      </main>

      <OilFooter />
    </>
  );
};

export default MainpageContainer;

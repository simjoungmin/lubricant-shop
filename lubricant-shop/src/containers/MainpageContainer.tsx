import OilHeader from "@/components/layout/OilHeader";
import BrandSection from "@/components/main/BrandSection";
import CategorySection from "@/components/main/CategorySection";
import HeroSection from "@/components/main/HeroSection";
import ProductSection from "@/components/main/ProductSection";
import ServiceBannerSection from "@/components/main/ServiceBannerSection";
import ShortClipSection from "@/components/main/ShortClipSection";
import { displayApi } from "@/components/main/display.api";

const MainpageContainer = async () => {
  const displaySections = await displayApi.findSections();

  return (
    <>
      <OilHeader />

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
    </>
  );
};

export default MainpageContainer;
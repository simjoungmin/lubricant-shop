import OilFooter from "@/components/layout/OilFooter";
import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
  shouldShowFooter?: boolean;
};

export function PageLayout({ children, shouldShowFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#071d3b]">
      {children}
      {shouldShowFooter ? <OilFooter /> : null}
    </div>
  );
}

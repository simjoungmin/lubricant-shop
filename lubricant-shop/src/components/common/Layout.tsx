import OilFooter from "@/components/layout/OilFooter";
import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
  shouldShowFooter?: boolean;
};

export function PageLayout({ children, shouldShowFooter = true }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#071d3b]">
      <div className="flex-1">{children}</div>
      {shouldShowFooter ? <OilFooter /> : null}
    </div>
  );
}

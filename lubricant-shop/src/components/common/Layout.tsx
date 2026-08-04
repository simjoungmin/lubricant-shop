import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#11100d] text-white">
      {children}
    </div>
  );
}
import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return <div className="min-h-screen bg-[#f7f7f5] text-[#071d3b]">{children}</div>;
}

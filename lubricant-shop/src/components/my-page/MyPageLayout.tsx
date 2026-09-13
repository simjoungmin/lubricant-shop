import { MyPageSidebar } from "@/components/my-page/MyPageSidebar";
import type { ReactNode } from "react";

type MyPageLayoutProps = {
  activeMenu: "profile" | "orders" | "inquiries";
  children: ReactNode;
  contentClassName?: string;
};

export function MyPageLayout({
  activeMenu,
  children,
  contentClassName = "",
}: MyPageLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-72px)] border-t border-[#e2e6eb] bg-white text-[#071d3b]">
      <div className="mx-auto grid w-full max-w-[1320px] lg:grid-cols-[170px_1fr]">
        <MyPageSidebar activeMenu={activeMenu} />
        <div className={`px-6 py-8 lg:px-10 ${contentClassName}`}>{children}</div>
      </div>
    </main>
  );
}

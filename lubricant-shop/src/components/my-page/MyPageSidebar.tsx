import Link from "next/link";

type MyPageSidebarProps = {
  activeMenu: "profile" | "orders" | "inquiries";
};

export function MyPageSidebar({ activeMenu }: MyPageSidebarProps) {
  const getLinkClassName = (menu: MyPageSidebarProps["activeMenu"]) =>
    activeMenu === menu
      ? "border-l-4 border-[#ff4b1f] pl-3 font-black text-[#071d3b]"
      : "transition hover:text-[#ff4b1f]";

  return (
    <aside className="border-b border-[#e2e6eb] px-6 py-8 lg:min-h-[calc(100vh-72px)] lg:border-b-0 lg:border-r lg:px-8">
      <h2 className="text-xl font-black text-[#071d3b]">마이페이지</h2>
      <div className="mt-5 h-px bg-[#dce2e8]" />
      <nav className="mt-7 grid gap-5 text-base font-bold text-[#65717f]">
        <Link href="/my-page" className={getLinkClassName("profile")}>
          내 정보
        </Link>
        <Link href="/my-page/orders" className={getLinkClassName("orders")}>
          주문 내역
        </Link>
        <Link href="/my-page/inquiries" className={getLinkClassName("inquiries")}>
          내 문의
        </Link>
      </nav>
    </aside>
  );
}

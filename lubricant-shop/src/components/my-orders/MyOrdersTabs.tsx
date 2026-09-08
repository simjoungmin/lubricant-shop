import Link from "next/link";

const tabs = [
  { label: "주문 내역", value: "4건", href: "/my-page/orders", isActive: true },
  { label: "취소/반품 내역", value: "준비 중", href: "/my-page/orders" },
  { label: "찜한 상품", value: "준비 중", href: "/my-page" },
  { label: "쿠폰함", value: "준비 중", href: "/my-page" },
  { label: "회원정보 수정", value: "준비 중", href: "/my-page" },
];

export function MyOrdersTabs() {
  return (
    <nav className="grid overflow-hidden rounded-lg border border-[#dde2e8] bg-white md:grid-cols-5">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`border-b border-[#eef1f4] px-5 py-5 transition last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${
            tab.isActive ? "bg-[#f7f7f5] shadow-[inset_0_-3px_0_#071d3b]" : "hover:bg-[#f8fafb]"
          }`}
        >
          <p className="text-sm font-black text-[#071d3b]">{tab.label}</p>
          <p className="mt-1 text-xs font-bold text-[#65717f]">{tab.value}</p>
        </Link>
      ))}
    </nav>
  );
}

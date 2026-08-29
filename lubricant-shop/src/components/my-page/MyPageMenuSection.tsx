import Link from "next/link";
import { MyPageMenuCard } from "./MyPageMenuCard";
import type { MyPageLinkItem, MyPagePendingItem } from "./my-page.types";

type MyPageMenuSectionProps = {
  title: string;
  linkItems?: MyPageLinkItem[];
  pendingItems: MyPagePendingItem[];
  sideLink?: {
    href: string;
    label: string;
  };
};

export function MyPageMenuSection({
  title,
  linkItems = [],
  pendingItems,
  sideLink,
}: MyPageMenuSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {sideLink ? (
          <Link href={sideLink.href} className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
            {sideLink.label}
          </Link>
        ) : null}
      </div>
      <div className="grid gap-3">
        {linkItems.map((item) => (
          <MyPageMenuCard key={item.title} item={item} variant="link" />
        ))}
        {pendingItems.map((item) => (
          <MyPageMenuCard key={item.title} item={item} variant="pending" />
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { MyPageLinkItem, MyPagePendingItem } from "./my-page.types";

type MyPageMenuCardProps =
  | {
      item: MyPageLinkItem;
      variant: "link";
    }
  | {
      item: MyPagePendingItem;
      variant: "pending";
    };

const menuLinkClassName =
  "group block rounded-lg border border-white/10 bg-[#171611] p-5 transition hover:border-[#d6a84f]";

const menuDisabledClassName = "rounded-lg border border-white/10 bg-[#171611] p-5 opacity-70";

export function MyPageMenuCard({ item, variant }: MyPageMenuCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-black text-white">{item.title}</p>
        <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">{item.description}</p>
      </div>
      {variant === "link" ? (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition group-hover:border-[#d6a84f] group-hover:text-[#d6a84f]"
        >
          →
        </span>
      ) : (
        <span className="shrink-0 rounded-md border border-white/10 px-3 py-1 text-xs font-black text-zinc-400">
          {item.status}
        </span>
      )}
    </div>
  );

  if (variant === "link") {
    return (
      <Link href={item.href} className={menuLinkClassName}>
        {content}
      </Link>
    );
  }

  return <div className={menuDisabledClassName}>{content}</div>;
}

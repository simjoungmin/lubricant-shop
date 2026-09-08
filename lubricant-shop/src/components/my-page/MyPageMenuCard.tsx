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
  "group block rounded-lg border border-[#dde2e8] bg-white p-5 transition hover:border-[#ff8a65] hover:shadow-[0_14px_28px_rgba(7,29,59,0.08)]";

const menuDisabledClassName =
  "rounded-lg border border-[#dde2e8] bg-white p-5 opacity-70";

export function MyPageMenuCard({ item, variant }: MyPageMenuCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-black text-[#071d3b]">{item.title}</p>
        <p className="mt-2 text-sm font-bold leading-6 text-[#65717f]">{item.description}</p>
      </div>
      {variant === "link" ? (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#dce2e8] text-[#65717f] transition group-hover:border-[#ff4b1f] group-hover:text-[#ff4b1f]"
        >
          ›
        </span>
      ) : (
        <span className="shrink-0 rounded-md border border-[#dce2e8] px-3 py-1 text-xs font-black text-[#65717f]">
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

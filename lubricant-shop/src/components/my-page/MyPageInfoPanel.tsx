import type { MyPageInfoItem } from "./my-page.types";

type MyPageInfoPanelProps = {
  title: string;
  description?: string;
  items: MyPageInfoItem[];
  tone?: "default" | "danger";
};

export function MyPageInfoPanel({
  title,
  description,
  items,
  tone = "default",
}: MyPageInfoPanelProps) {
  const accentClassName = tone === "danger" ? "bg-[#d93636]" : "bg-[#ff4b1f]";

  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${accentClassName}`} />
        <div>
          <h2 className="text-xl font-black text-[#071d3b]">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm font-bold leading-6 text-[#65717f]">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 divide-y divide-[#e2e7ee] border-y border-[#e2e7ee]">
        {items.map((item) => (
          <article key={item.title} className="grid gap-2 py-4 md:grid-cols-[150px_1fr] md:gap-5">
            <h3 className="text-sm font-black text-[#071d3b]">{item.title}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#65717f] md:mt-0">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

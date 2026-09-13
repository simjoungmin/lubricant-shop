import Link from "next/link";

type MyPageAccountActionCardProps = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
};

export function MyPageAccountActionCard({
  title,
  description,
  href,
  buttonLabel,
}: MyPageAccountActionCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-lg border border-[#dde2e8] bg-white p-6 transition hover:border-[#c6d0dc] hover:shadow-[0_14px_30px_rgba(7,29,59,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-black text-[#071d3b]">{title}</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-[#65717f]">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-md border border-[#b8c2cf] bg-[#f8fafc] px-5 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b] hover:bg-white"
      >
        {buttonLabel}
      </Link>
    </article>
  );
}

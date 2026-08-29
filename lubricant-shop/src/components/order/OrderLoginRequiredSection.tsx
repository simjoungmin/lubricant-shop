import Link from "next/link";

type OrderLoginRequiredSectionProps = {
  href: string;
};

export function OrderLoginRequiredSection({
  href,
}: OrderLoginRequiredSectionProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <p className="text-sm font-bold text-zinc-300">
        로그인하면 주문서를 작성할 수 있습니다.
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
      >
        로그인하러 가기
      </Link>
    </section>
  );
}

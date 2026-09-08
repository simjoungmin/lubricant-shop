import Link from "next/link";

type OrderLoginRequiredSectionProps = {
  href: string;
};

export function OrderLoginRequiredSection({
  href,
}: OrderLoginRequiredSectionProps) {
  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
      <p className="text-sm font-bold text-[#65717f]">
        로그인하면 주문서를 작성할 수 있습니다.
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#071d3b] px-5 text-sm font-black text-white transition hover:bg-[#12345f]"
      >
        로그인하러 가기
      </Link>
    </section>
  );
}

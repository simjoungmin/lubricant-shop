import Link from "next/link";

type MyOrdersStateSectionProps = {
  message: string;
  shouldShowLoginLink?: boolean;
};

export function MyOrdersStateSection({ message, shouldShowLoginLink = false }: MyOrdersStateSectionProps) {
  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-8 text-center">
      <p className="text-sm font-bold text-[#34465c]">{message}</p>
      {shouldShowLoginLink ? (
        <Link
          href="/login"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#ff4b1f] px-5 text-sm font-black text-white transition hover:bg-[#e63e16]"
        >
          로그인하러 가기
        </Link>
      ) : null}
    </section>
  );
}

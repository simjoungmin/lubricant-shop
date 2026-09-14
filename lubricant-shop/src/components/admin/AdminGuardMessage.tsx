import Link from "next/link";

type AdminGuardMessageProps = {
  message: string;
  showLoginLink?: boolean;
  className?: string;
};

export function AdminGuardMessage({
  message,
  showLoginLink = false,
  className = "",
}: AdminGuardMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <section
      className={`rounded-lg border border-white/10 bg-[#171611] p-5 ${className}`.trim()}
      role="status"
    >
      <p className="text-sm font-bold text-zinc-300">{message}</p>
      {showLoginLink ? (
        <Link
          href="/login"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
        >
          로그인하러 가기
        </Link>
      ) : null}
    </section>
  );
}

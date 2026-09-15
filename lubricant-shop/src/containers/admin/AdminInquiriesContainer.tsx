"use client";

import { AdminGuardMessage, type AdminNoticeVariant } from "@/components/admin/AdminGuardMessage";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminInquiries } from "@/hooks/useInquiries";
import Link from "next/link";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function AdminInquiriesContainer() {
  const { isReady, isAdmin, showLoginLink } = useAdminAccess();
  const inquiriesQuery = useAdminInquiries(isReady && isAdmin);
  const inquiries = inquiriesQuery.data ?? [];

  const message = !isReady
    ? "문의 목록을 불러오는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 문의를 확인할 수 있습니다."
      : inquiriesQuery.isPending
        ? "문의 목록을 불러오는 중입니다."
        : inquiriesQuery.isError
          ? inquiriesQuery.error.message
          : inquiries.length === 0 ? "접수된 문의가 없습니다." : "";
  const messageVariant: AdminNoticeVariant = inquiriesQuery.isError ? "error" : "info";

  return (
    <>
      <OilHeader />

      <main className="min-h-[calc(100vh-64px)] bg-[#11100d]">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
              관리자 홈
            </Link>
            <p className="mt-6 text-sm font-bold text-[#d6a84f]">ADMIN</p>
            <h1 className="mt-3 text-3xl font-black text-white">문의 확인</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              고객센터에서 접수된 1:1 문의가 최신순으로 표시됩니다.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]"
          >
            주문 관리로 이동
          </Link>
        </div>

        {!isReady || inquiriesQuery.isPending || message ? (
          <AdminGuardMessage
            message={message}
            showLoginLink={showLoginLink}
            variant={messageVariant}
          />
        ) : (
          <section className="grid gap-4">
            {inquiries.map((inquiry) => (
              <article
                key={inquiry.boardId}
                className="rounded-lg border border-white/10 bg-[#171611] p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#d6a84f]">
                      {inquiry.inquiryCategory} / {inquiry.inquiryGroup} / {inquiry.inquiryTopic}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-white">{inquiry.title}</h2>
                  </div>
                  <span className="inline-flex h-8 items-center rounded-md border border-white/10 px-3 text-xs font-black text-zinc-300">
                    {inquiry.answerStatus === "WAITING" ? "답변 대기" : "답변 완료"}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm md:grid-cols-4">
                  <div>
                    <dt className="font-bold text-zinc-500">작성 회원</dt>
                    <dd className="mt-1 font-black text-zinc-200">
                      {inquiry.writerName} #{inquiry.writerId}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">연락처 이름</dt>
                    <dd className="mt-1 font-black text-zinc-200">{inquiry.contactName}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">이메일</dt>
                    <dd className="mt-1 font-black text-zinc-200">{inquiry.contactEmail}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">접수일</dt>
                    <dd className="mt-1 font-black text-zinc-200">
                      {formatDateTime(inquiry.createdAt)}
                    </dd>
                  </div>
                </dl>

                {inquiry.orderNumber || inquiry.vehicleInfo ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                    {inquiry.orderNumber ? (
                      <span className="rounded-md bg-black/30 px-3 py-2">
                        주문번호 {inquiry.orderNumber}
                      </span>
                    ) : null}
                    {inquiry.vehicleInfo ? (
                      <span className="rounded-md bg-black/30 px-3 py-2">
                        차량 {inquiry.vehicleInfo}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <p className="mt-5 whitespace-pre-wrap rounded-md bg-black/20 p-4 text-sm leading-7 text-zinc-300">
                  {inquiry.content}
                </p>

                <Link
                  href={`/admin/inquiries/${inquiry.boardId}`}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
                >
                  문의 상세 및 답변
                </Link>
              </article>
            ))}
          </section>
        )}
        </div>
      </main>
    </>
  );
}

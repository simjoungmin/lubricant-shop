"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { useAdminInquiryDetail, useCreateInquiryAnswer } from "@/hooks/useInquiries";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function AdminInquiryDetailContainer() {
  const params = useParams<{ boardId: string }>();
  const boardId = Number(params.boardId);
  const { user, isReady } = useAuth();
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "ADMIN";
  const detailQuery = useAdminInquiryDetail(boardId, isReady && isAdmin);
  const createAnswerMutation = useCreateInquiryAnswer(boardId);
  const detail = detailQuery.data ?? null;

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!answer.trim()) {
      setMessage("답변 내용을 입력해 주세요.");
      return;
    }

    setMessage("");

    try {
      await createAnswerMutation.mutateAsync(answer.trim());
      setAnswer("");
      setMessage("답변이 등록되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "답변 등록에 실패했습니다.");
    }
  };

  const guardMessage = !isReady
    ? "문의 내용을 불러오는 중입니다."
    : !isAdmin
      ? "관리자 계정으로 로그인하면 문의에 답변할 수 있습니다."
      : detailQuery.isPending
        ? "문의 내용을 불러오는 중입니다."
        : detailQuery.isError
          ? detailQuery.error.message
          : message;

  return (
    <>
      <OilHeader />

      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[960px] px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/inquiries" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
            문의 목록으로 돌아가기
          </Link>
          <p className="mt-8 text-sm font-black text-[#d6a84f]">ADMIN REPLY</p>
          <h1 className="mt-3 text-3xl font-black text-white">문의 상세 및 답변</h1>
        </div>

        {guardMessage && !detail ? (
          <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
          </section>
        ) : null}

        {detail ? (
          <div className="grid gap-5">
            <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#d6a84f]">
                    {detail.inquiry.inquiryCategory} / {detail.inquiry.inquiryGroup} / {detail.inquiry.inquiryTopic}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">{detail.inquiry.title}</h2>
                </div>
                <span className="inline-flex h-8 items-center rounded-md border border-white/10 px-3 text-xs font-black text-zinc-300">
                  {detail.inquiry.answerStatus === "WAITING" ? "답변 대기" : "답변 완료"}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <dt className="font-bold text-zinc-500">작성 회원</dt>
                  <dd className="mt-1 font-black text-zinc-200">
                    {detail.inquiry.writerName} #{detail.inquiry.writerId}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-zinc-500">이메일</dt>
                  <dd className="mt-1 font-black text-zinc-200">{detail.inquiry.contactEmail}</dd>
                </div>
                <div>
                  <dt className="font-bold text-zinc-500">접수일</dt>
                  <dd className="mt-1 font-black text-zinc-200">
                    {formatDateTime(detail.inquiry.createdAt)}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 whitespace-pre-wrap rounded-md bg-black/20 p-4 text-sm leading-7 text-zinc-300">
                {detail.inquiry.content}
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
              <h2 className="text-xl font-black text-white">등록된 답변</h2>
              <div className="mt-4 grid gap-3">
                {detail.answers.length > 0 ? (
                  detail.answers.map((item) => (
                    <article key={item.answerId} className="rounded-md bg-black/20 p-4">
                      <p className="text-xs font-bold text-zinc-500">
                        {item.adminName} · {formatDateTime(item.createdAt)}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{item.content}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm font-bold text-zinc-400">아직 등록된 답변이 없습니다.</p>
                )}
              </div>
            </section>

            <form className="grid gap-4 rounded-lg border border-white/10 bg-[#171611] p-6" onSubmit={submitAnswer}>
              <label className="grid gap-2 text-sm font-bold text-zinc-200">
                답변 작성
                <textarea
                  className="min-h-44 rounded-md border border-white/10 bg-[#11100d] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d6a84f]"
                  placeholder="고객에게 전달할 답변을 입력해 주세요."
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setMessage("");
                  }}
                />
              </label>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {message ? <p className="text-sm font-bold text-zinc-300">{message}</p> : <span />}
                <button
                  type="submit"
                  disabled={createAnswerMutation.isPending}
                  className="h-11 rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
                >
                  {createAnswerMutation.isPending ? "등록 중..." : "답변 등록"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </>
  );
}

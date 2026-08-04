"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import OilHeader from "@/components/layout/OilHeader";
import { useMyInquiries, useMyInquiryDetail, useOpenMyInquiry } from "@/hooks/useInquiries";
import Link from "next/link";
import { useState } from "react";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function MyInquiriesContainer() {
  const { user, isReady } = useAuth();
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const inquiriesQuery = useMyInquiries(isReady && Boolean(user));
  const detailQuery = useMyInquiryDetail(selectedBoardId, isReady && Boolean(user));
  const openInquiryMutation = useOpenMyInquiry();
  const inquiries = inquiriesQuery.data ?? [];
  const selectedDetail = detailQuery.data ?? null;

  const handleOpenInquiry = async (boardId: number) => {
    setSelectedBoardId(boardId);
    setMessage("");

    try {
      await openInquiryMutation.mutateAsync(boardId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문의 내용을 불러오지 못했습니다.");
    }
  };

  const guardMessage = !isReady
    ? "문의 목록을 불러오는 중입니다."
    : !user
      ? "로그인 후 내가 작성한 문의를 확인할 수 있습니다."
      : inquiriesQuery.isPending
        ? "문의 목록을 불러오는 중입니다."
        : inquiriesQuery.isError
          ? inquiriesQuery.error.message
          : message || (inquiries.length === 0 ? "접수한 문의가 없습니다." : "");

  return (
    <>
      <OilHeader />

      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1180px] px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/my-page" className="text-sm font-bold text-zinc-400 hover:text-[#d6a84f]">
            내 정보로 돌아가기
          </Link>
          <p className="mt-8 text-sm font-black text-[#d6a84f]">MY INQUIRIES</p>
          <h1 className="mt-3 text-3xl font-black text-white">내 문의 확인</h1>
        </div>

        {guardMessage ? (
          <section className="mb-5 rounded-lg border border-white/10 bg-[#171611] p-6">
            <p className="text-sm font-bold text-zinc-300">{guardMessage}</p>
            {isReady && !user ? (
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#d6a84f] px-5 text-sm font-black text-black transition hover:bg-[#f0c76a]"
              >
                로그인하러 가기
              </Link>
            ) : null}
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <section className="grid content-start gap-3">
            {inquiries.map((inquiry) => (
              <button
                key={inquiry.boardId}
                type="button"
                className="relative rounded-lg border border-white/10 bg-[#171611] p-5 text-left transition hover:border-[#d6a84f]"
                onClick={() => void handleOpenInquiry(inquiry.boardId)}
              >
                {inquiry.answerStatus === "ANSWERED" && !inquiry.answerChecked ? (
                  <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
                <p className="pr-5 text-sm font-black text-white">{inquiry.title}</p>
                <p className="mt-2 text-xs font-bold text-zinc-500">
                  {formatDateTime(inquiry.createdAt)}
                </p>
                <span className="mt-3 inline-flex h-7 items-center rounded-md border border-white/10 px-3 text-xs font-black text-zinc-300">
                  {inquiry.answerStatus === "WAITING" ? "답변 대기" : "답변 완료"}
                </span>
              </button>
            ))}
          </section>

          <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
            {detailQuery.isPending && selectedBoardId !== null ? (
              <p className="text-sm font-bold text-zinc-400">문의 내용을 불러오는 중입니다.</p>
            ) : selectedDetail ? (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#d6a84f]">
                  {selectedDetail.inquiry.inquiryCategory} / {selectedDetail.inquiry.inquiryTopic}
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">{selectedDetail.inquiry.title}</h2>
                <p className="mt-5 whitespace-pre-wrap rounded-md bg-black/20 p-4 text-sm leading-7 text-zinc-300">
                  {selectedDetail.inquiry.content}
                </p>

                <h3 className="mt-8 text-lg font-black text-white">답변</h3>
                <div className="mt-4 grid gap-3">
                  {selectedDetail.answers.length > 0 ? (
                    selectedDetail.answers.map((answer) => (
                      <article key={answer.answerId} className="rounded-md bg-black/20 p-4">
                        <p className="text-xs font-bold text-zinc-500">
                          {answer.adminName} · {formatDateTime(answer.createdAt)}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{answer.content}</p>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-zinc-400">아직 답변이 등록되지 않았습니다.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-bold text-zinc-400">왼쪽 목록에서 문의를 선택해주세요.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

"use client";

import { useAuth } from "@/components/auth/auth/AuthContext";
import type {
  AnswerResponse,
  InquiryDetailResponse,
  InquiryResponse,
} from "@/components/customer/inquiry.api";
import OilHeader from "@/components/layout/OilHeader";
import { MyPageLayout } from "@/components/my-page/MyPageLayout";
import { useMyInquiries, useMyInquiryDetail, useOpenMyInquiry } from "@/hooks/useInquiries";
import Link from "next/link";
import { useState } from "react";

type NoticeState = {
  message: string;
  shouldShowLoginLink: boolean;
};

type InquiryStatus = InquiryResponse["answerStatus"];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getNoticeState = ({
  isReady,
  hasUser,
  isPending,
  errorMessage,
  localMessage,
  inquiryCount,
}: {
  isReady: boolean;
  hasUser: boolean;
  isPending: boolean;
  errorMessage?: string;
  localMessage: string;
  inquiryCount: number;
}): NoticeState | null => {
  if (!isReady) {
    return { message: "문의 목록을 불러오는 중입니다.", shouldShowLoginLink: false };
  }

  if (!hasUser) {
    return {
      message: "로그인 후 내가 작성한 문의를 확인할 수 있습니다.",
      shouldShowLoginLink: true,
    };
  }

  if (isPending) {
    return { message: "문의 목록을 불러오는 중입니다.", shouldShowLoginLink: false };
  }

  if (errorMessage) {
    return { message: errorMessage, shouldShowLoginLink: false };
  }

  if (localMessage) {
    return { message: localMessage, shouldShowLoginLink: false };
  }

  if (inquiryCount === 0) {
    return { message: "접수한 문의가 없습니다.", shouldShowLoginLink: false };
  }

  return null;
};

export default function MyInquiriesContainer() {
  const { user, isReady } = useAuth();
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const hasUser = Boolean(user);
  const inquiriesQuery = useMyInquiries(isReady && hasUser);
  const inquiries = inquiriesQuery.data ?? [];
  const activeBoardId = selectedBoardId ?? inquiries[0]?.boardId ?? null;
  const detailQuery = useMyInquiryDetail(activeBoardId, isReady && hasUser);
  const openInquiryMutation = useOpenMyInquiry();
  const selectedDetail = detailQuery.data ?? null;
  const noticeState = getNoticeState({
    isReady,
    hasUser,
    isPending: inquiriesQuery.isPending,
    errorMessage: inquiriesQuery.isError ? inquiriesQuery.error.message : undefined,
    localMessage: message,
    inquiryCount: inquiries.length,
  });

  const handleOpenInquiry = async (boardId: number) => {
    setSelectedBoardId(boardId);
    setMessage("");

    try {
      await openInquiryMutation.mutateAsync(boardId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문의 내용을 불러오지 못했습니다.");
    }
  };

  return (
    <>
      <OilHeader />

      <MyPageLayout activeMenu="inquiries">
        <MyInquiriesHeader />

        {noticeState ? <MyInquiriesNotice notice={noticeState} /> : null}

        <div className="grid overflow-hidden rounded-lg border border-[#dce2e8] bg-white lg:grid-cols-[420px_1fr]">
          <InquiryList
            activeBoardId={activeBoardId}
            inquiries={inquiries}
            onOpenInquiry={(boardId) => void handleOpenInquiry(boardId)}
          />
          <InquiryDetailPanel
            activeBoardId={activeBoardId}
            detail={selectedDetail}
            isLoading={detailQuery.isPending}
            onResetSelection={() => setSelectedBoardId(null)}
          />
        </div>
      </MyPageLayout>
    </>
  );
}

function MyInquiriesHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-black text-[#ff4b1f]">MY PAGE</p>
        <h1 className="mt-3 text-4xl font-black text-[#071d3b]">내 문의</h1>
      </div>
      <Link
        href="/customer-center/inquiry"
        className="inline-flex h-12 items-center justify-center rounded-md bg-[#ff4b1f] px-7 text-sm font-black text-white transition hover:bg-[#e63e16]"
      >
        새 문의 작성
      </Link>
    </div>
  );
}

function MyInquiriesNotice({ notice }: { notice: NoticeState }) {
  return (
    <section className="mb-5 rounded-lg border border-[#dce2e8] bg-white p-6 shadow-[0_14px_30px_rgba(7,29,59,0.06)]">
      <p className="text-sm font-bold text-[#65717f]">{notice.message}</p>
      {notice.shouldShowLoginLink ? (
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

function InquiryList({
  activeBoardId,
  inquiries,
  onOpenInquiry,
}: {
  activeBoardId: number | null;
  inquiries: InquiryResponse[];
  onOpenInquiry: (boardId: number) => void;
}) {
  return (
    <section className="border-b border-[#dce2e8] lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between border-b border-[#dce2e8] px-5">
        <h2 className="text-lg font-black text-[#071d3b]">
          전체 문의 {inquiries.length.toLocaleString("ko-KR")}
        </h2>
        <span className="text-sm font-bold text-[#65717f]">최신순</span>
      </div>
      <div className="divide-y divide-[#edf0f3]">
        {inquiries.map((inquiry) => (
          <InquiryListItem
            key={inquiry.boardId}
            inquiry={inquiry}
            isSelected={inquiry.boardId === activeBoardId}
            onOpenInquiry={onOpenInquiry}
          />
        ))}
      </div>
    </section>
  );
}

function InquiryListItem({
  inquiry,
  isSelected,
  onOpenInquiry,
}: {
  inquiry: InquiryResponse;
  isSelected: boolean;
  onOpenInquiry: (boardId: number) => void;
}) {
  return (
    <button
      type="button"
      className={`grid w-full gap-3 px-5 py-5 text-left transition hover:bg-[#fff8f5] ${
        isSelected ? "bg-[#fff8f5] shadow-[inset_4px_0_0_#ff4b1f]" : "bg-white"
      }`}
      onClick={() => onOpenInquiry(inquiry.boardId)}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="flex items-start gap-3 text-base font-black text-[#071d3b]">
          <span
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
              isSelected ? "bg-[#ff4b1f]" : "bg-[#8a94a1]"
            }`}
          />
          {inquiry.title}
        </p>
        <InquiryStatusBadge status={inquiry.answerStatus} />
      </div>
      <p className="line-clamp-1 pl-5 text-sm font-bold text-[#65717f]">
        {inquiry.inquiryTopic}
      </p>
      <p className="pl-5 text-sm font-bold text-[#65717f]">
        {formatDateTime(inquiry.createdAt)}
      </p>
    </button>
  );
}

function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const isAnswered = status === "ANSWERED";

  return (
    <span
      className={`w-fit shrink-0 rounded-md border px-3 py-1 text-xs font-black ${
        isAnswered
          ? "border-[#ffd3c5] bg-[#fff3ef] text-[#ff4b1f]"
          : "border-[#dce2e8] bg-[#f8fafc] text-[#65717f]"
      }`}
    >
      {isAnswered ? "답변 완료" : "답변 대기"}
    </span>
  );
}

function InquiryDetailPanel({
  activeBoardId,
  detail,
  isLoading,
  onResetSelection,
}: {
  activeBoardId: number | null;
  detail: InquiryDetailResponse | null;
  isLoading: boolean;
  onResetSelection: () => void;
}) {
  if (isLoading && activeBoardId !== null) {
    return (
      <section className="min-h-[520px] p-6">
        <p className="text-sm font-bold text-[#65717f]">문의 내용을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="min-h-[520px] p-6">
        <p className="text-sm font-bold text-[#65717f]">왼쪽 목록에서 문의를 선택해주세요.</p>
      </section>
    );
  }

  return (
    <section className="min-h-[520px] p-6">
      <InquiryDetailHeader detail={detail} />
      <InquiryTimeline detail={detail} />
      <InquiryDetailActions onResetSelection={onResetSelection} />
    </section>
  );
}

function InquiryDetailHeader({ detail }: { detail: InquiryDetailResponse }) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#dce2e8] pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-bold text-[#65717f]">
          문의번호 #{detail.inquiry.boardId}
        </p>
        <h2 className="mt-3 text-2xl font-black text-[#071d3b]">
          {detail.inquiry.title}
        </h2>
      </div>
      <div className="grid justify-start gap-3 text-left sm:justify-items-end sm:text-right">
        <InquiryStatusBadge status={detail.inquiry.answerStatus} />
        <p className="text-sm font-bold text-[#65717f]">
          {formatDateTime(detail.inquiry.createdAt)}
        </p>
      </div>
    </div>
  );
}

function InquiryTimeline({ detail }: { detail: InquiryDetailResponse }) {
  return (
    <div className="mt-7 grid gap-7">
      <InquiryQuestion inquiry={detail.inquiry} />
      <div className="h-px bg-[#dce2e8]" />
      {detail.answers.length > 0 ? (
        detail.answers.map((answer) => (
          <InquiryAnswer key={answer.answerId} answer={answer} />
        ))
      ) : (
        <p className="text-sm font-bold text-[#65717f]">
          아직 답변이 등록되지 않았습니다.
        </p>
      )}
    </div>
  );
}

function InquiryQuestion({ inquiry }: { inquiry: InquiryResponse }) {
  return (
    <article className="grid gap-4 sm:grid-cols-[56px_1fr]">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8a94a1] text-sm font-black text-white">
        ME
      </div>
      <div>
        <p className="font-black text-[#071d3b]">문의 내용</p>
        <p className="mt-1 text-sm font-bold text-[#65717f]">
          {formatDateTime(inquiry.createdAt)}
        </p>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#34465c]">
          {inquiry.content}
        </p>
      </div>
    </article>
  );
}

function InquiryAnswer({ answer }: { answer: AnswerResponse }) {
  return (
    <article className="grid gap-4 sm:grid-cols-[56px_1fr]">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071d3b] text-[10px] font-black leading-tight text-white">
        OIL
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-black text-[#071d3b]">OIL MASTER 고객센터</p>
          <span className="rounded-md border border-[#ffd3c5] bg-[#fff3ef] px-3 py-1 text-xs font-black text-[#ff4b1f]">
            답변 완료
          </span>
        </div>
        <p className="mt-1 text-sm font-bold text-[#65717f]">
          {formatDateTime(answer.createdAt)}
        </p>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#34465c]">
          {answer.content}
        </p>
      </div>
    </article>
  );
}

function InquiryDetailActions({ onResetSelection }: { onResetSelection: () => void }) {
  return (
    <div className="mt-8 flex justify-end gap-3 border-t border-[#dce2e8] pt-5">
      <button
        className="h-11 rounded-md border border-[#dce2e8] px-7 text-sm font-black text-[#071d3b] transition hover:border-[#071d3b]"
        type="button"
        onClick={onResetSelection}
      >
        목록으로
      </button>
      <Link
        href="/customer-center/inquiry"
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#ff4b1f] px-7 text-sm font-black text-white transition hover:bg-[#e63e16]"
      >
        추가 문의하기
      </Link>
    </div>
  );
}

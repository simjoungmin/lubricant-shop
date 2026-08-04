"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  inquiryApi,
  type InquiryDetailResponse,
  type InquiryResponse,
} from "@/components/customer/inquiry.api";

const adminInquiriesQueryKey = ["admin", "inquiries"] as const;
const myInquiriesQueryKey = ["my", "inquiries"] as const;

const adminInquiryDetailQueryKey = (boardId: number) =>
  ["admin", "inquiries", boardId] as const;

const myInquiryDetailQueryKey = (boardId: number) =>
  ["my", "inquiries", boardId] as const;

export function useAdminInquiries(isEnabled: boolean) {
  return useQuery({
    queryKey: adminInquiriesQueryKey,
    queryFn: inquiryApi.findAdminInquiries,
    enabled: isEnabled,
  });
}

export function useAdminInquiryDetail(boardId: number, isEnabled: boolean) {
  return useQuery({
    queryKey: adminInquiryDetailQueryKey(boardId),
    queryFn: () => inquiryApi.findAdminInquiry(boardId),
    enabled: isEnabled && !Number.isNaN(boardId),
  });
}

export function useCreateInquiryAnswer(boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => inquiryApi.createAnswer(boardId, content),
    onSuccess: (detail) => {
      queryClient.setQueryData(adminInquiryDetailQueryKey(boardId), detail);
      queryClient.setQueryData<InquiryResponse[]>(adminInquiriesQueryKey, (inquiries) =>
        inquiries?.map((inquiry) =>
          inquiry.boardId === boardId
            ? { ...inquiry, answerStatus: detail.inquiry.answerStatus }
            : inquiry,
        ),
      );
    },
  });
}

export function useMyInquiries(isEnabled: boolean) {
  return useQuery({
    queryKey: myInquiriesQueryKey,
    queryFn: inquiryApi.findMyInquiries,
    enabled: isEnabled,
  });
}

export function useMyInquiryDetail(boardId: number | null, isEnabled: boolean) {
  return useQuery({
    queryKey: boardId === null ? ["my", "inquiries", "none"] : myInquiryDetailQueryKey(boardId),
    queryFn: () => inquiryApi.findMyInquiry(boardId ?? 0),
    enabled: isEnabled && boardId !== null,
  });
}

export function useOpenMyInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId: number) => {
      const detail = await queryClient.fetchQuery({
        queryKey: myInquiryDetailQueryKey(boardId),
        queryFn: () => inquiryApi.findMyInquiry(boardId),
      });

      if (detail.inquiry.answerStatus !== "ANSWERED" || detail.inquiry.answerChecked) {
        return detail;
      }

      return inquiryApi.markAnswerChecked(boardId);
    },
    onSuccess: (detail: InquiryDetailResponse) => {
      const boardId = detail.inquiry.boardId;

      queryClient.setQueryData(myInquiryDetailQueryKey(boardId), detail);
      queryClient.setQueryData<InquiryResponse[]>(myInquiriesQueryKey, (inquiries) =>
        inquiries?.map((inquiry) =>
          inquiry.boardId === boardId ? { ...inquiry, answerChecked: true } : inquiry,
        ),
      );
    },
  });
}

export function useHasUnreadAnswer(isEnabled: boolean) {
  return useQuery({
    queryKey: ["my", "inquiries", "has-unread-answer"],
    queryFn: inquiryApi.hasUnreadAnswer,
    enabled: isEnabled,
    refetchInterval: 30_000,
  });
}

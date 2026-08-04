const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type InquiryPayload = {
  title: string;
  content: string;
  contactName: string;
  contactEmail: string;
  inquiryCategory: string;
  inquiryGroup: string;
  inquiryTopic: string;
  orderNumber?: string;
  vehicleInfo?: string;
};

export type InquiryResponse = InquiryPayload & {
  boardId: number;
  writerId: number;
  writerName: string;
  answerStatus: "WAITING" | "ANSWERED";
  answerChecked: boolean;
  createdAt: string;
};

export type AnswerResponse = {
  answerId: number;
  adminId: number;
  adminName: string;
  content: string;
  createdAt: string;
};

export type InquiryDetailResponse = {
  inquiry: InquiryResponse;
  answers: AnswerResponse[];
};

const readApiMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? "요청 처리에 실패했습니다.";
  } catch {
    return "요청 처리에 실패했습니다.";
  }
};

export const inquiryApi = {
  create: async (payload: InquiryPayload) => {
    const response = await fetch(`${API_BASE_URL}/api/boards/inquiries`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryResponse;
  },

  findAdminInquiries: async () => {
    const response = await fetch(`${API_BASE_URL}/api/boards/admin/inquiries`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryResponse[];
  },

  findAdminInquiry: async (boardId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/boards/admin/inquiries/${boardId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryDetailResponse;
  },

  createAnswer: async (boardId: number, content: string) => {
    const response = await fetch(`${API_BASE_URL}/api/boards/admin/inquiries/${boardId}/answers`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryDetailResponse;
  },

  findMyInquiries: async () => {
    const response = await fetch(`${API_BASE_URL}/api/boards/my/inquiries`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryResponse[];
  },

  findMyInquiry: async (boardId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/boards/my/inquiries/${boardId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryDetailResponse;
  },

  markAnswerChecked: async (boardId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/boards/my/inquiries/${boardId}/answer-checked`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as InquiryDetailResponse;
  },

  hasUnreadAnswer: async () => {
    const response = await fetch(`${API_BASE_URL}/api/boards/my/inquiries/has-unread-answer`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await readApiMessage(response));
    }

    return (await response.json()) as { hasUnreadAnswer: boolean };
  },
};

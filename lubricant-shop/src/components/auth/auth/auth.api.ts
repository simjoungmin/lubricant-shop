import { getApiErrorMessage } from "./auth.errors";
import type { AuthProviderName, EmailLoginInput, MemberResponse } from "./auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const requestJson = async <ResponseBody>(path: string, init?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as ResponseBody;
};

const socialLoginPathByProvider: Record<Exclude<AuthProviderName, "email">, string> = {
  kakao: "/api/auth/kakao/login",
  naver: "/api/auth/naver/login",
};

export const authApi = {
  me: () => requestJson<MemberResponse>("/api/members/me"),

  login: (input: EmailLoginInput) =>
    requestJson<MemberResponse>("/api/members/login", {
      method: "POST",
      body: JSON.stringify({
        email: input.email.trim(),
        password: input.password,
      }),
    }),

  startSocialLogin: (provider: Exclude<AuthProviderName, "email">) => {
    window.location.href = `${API_BASE_URL}${socialLoginPathByProvider[provider]}`;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/members/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response));
    }
  },
};
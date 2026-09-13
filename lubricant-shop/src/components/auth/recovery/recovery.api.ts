import { getApiErrorMessage } from "../auth/auth.errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const postJson = async <ResponseBody>(path: string, body: unknown) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return (await response.json()) as ResponseBody;
};

export type PasswordVerificationMethod = "EMAIL" | "PHONE";

export const recoveryApi = {
  findEmail: (phone: string) =>
    postJson<{ loginId: string }>("/api/members/find-email", {
      phone,
    }),

  sendPasswordVerificationCode: (email: string, method: PasswordVerificationMethod) =>
    postJson<{ message: string; devCode: string }>("/api/members/password/verification-code", {
      email,
      method,
    }),

  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
    newPasswordConfirm: string,
  ) =>
    postJson<{ message: string }>("/api/members/password/reset", {
      email,
      code,
      newPassword,
      newPasswordConfirm,
    }),
};

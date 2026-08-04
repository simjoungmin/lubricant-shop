import { getApiErrorMessage } from "../auth/auth.errors";
import type { SignupPayload } from "./signup.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const signupApi = {
  checkEmail: async (email: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/members/email-exists?email=${encodeURIComponent(email)}`,
    );

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response));
    }

    return (await response.json()) as { duplicated: boolean };
  },

  signup: async (payload: SignupPayload) => {
    const response = await fetch(`${API_BASE_URL}/api/members/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response));
    }
  },
};

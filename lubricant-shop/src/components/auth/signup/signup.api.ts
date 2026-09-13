import { getApiErrorMessage } from "../auth/auth.errors";
import type { SignupFormState, SignupPayload } from "./signup.types";

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

export const toSignupPayload = (signupForm: SignupFormState): SignupPayload => ({
  email: signupForm.email.trim().toLowerCase(),
  loginId: signupForm.loginId.trim().toLowerCase(),
  password: signupForm.password,
  name: signupForm.name.trim(),
  address: [signupForm.postalCode, signupForm.address, signupForm.detailAddress]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" "),
  phone: signupForm.phone.trim(),
  termsAgreed: signupForm.termsAgreed,
  privacyAgreed: signupForm.privacyAgreed,
  marketingAgreed: signupForm.marketingAgreed,
  vehicleInfo: signupForm.vehicleEnabled ? signupForm.vehicleInfo.trim() : "",
});

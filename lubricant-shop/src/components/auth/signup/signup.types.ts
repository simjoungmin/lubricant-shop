export type SignupFormState = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  vehicleEnabled: boolean;
  vehicleInfo: string;
  marketingAgreed: boolean;
};

export type SignupErrors = Partial<Record<keyof SignupFormState | "emailCheck" | "submit", string>>;

export type EmailCheckState = "idle" | "checking" | "available" | "duplicated";

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  vehicleInfo: string;
};

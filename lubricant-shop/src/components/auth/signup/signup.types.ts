export type SignupSavedFieldState = {
  email: string;
  loginId: string;
  password: string;
  name: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  phone: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  vehicleInfo: string;
  marketingAgreed: boolean;
};

export type SignupUiOnlyFieldState = {
  passwordConfirm: string;
  privacyDelegationAgreed: boolean;
  vehicleEnabled: boolean;
};

export type SignupFormState = SignupSavedFieldState & SignupUiOnlyFieldState;

export type SignupErrors = Partial<Record<keyof SignupFormState | "emailCheck" | "submit", string>>;

export type EmailCheckState = "idle" | "checking" | "available" | "duplicated";

export type SignupFormUpdateHandler = <Field extends keyof SignupFormState>(
  field: Field,
  value: SignupFormState[Field],
) => void;

export type SignupPayload = {
  email: string;
  loginId: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  vehicleInfo: string;
};

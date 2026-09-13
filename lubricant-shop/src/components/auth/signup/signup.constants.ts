import type { SignupFormState, SignupSavedFieldState, SignupUiOnlyFieldState } from "./signup.types";

export const initialSignupSavedFields: SignupSavedFieldState = {
  email: "",
  loginId: "",
  password: "",
  name: "",
  postalCode: "",
  address: "",
  detailAddress: "",
  phone: "",
  termsAgreed: false,
  privacyAgreed: false,
  vehicleInfo: "",
  marketingAgreed: false,
};

export const initialSignupUiOnlyFields: SignupUiOnlyFieldState = {
  passwordConfirm: "",
  privacyDelegationAgreed: false,
  vehicleEnabled: false,
};

export const initialSignupForm: SignupFormState = {
  ...initialSignupSavedFields,
  ...initialSignupUiOnlyFields,
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

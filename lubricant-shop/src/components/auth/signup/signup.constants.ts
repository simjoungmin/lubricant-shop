import type { SignupFormState } from "./signup.types";

export const initialSignupForm: SignupFormState = {
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  phone: "",
  termsAgreed: false,
  privacyAgreed: false,
  vehicleEnabled: false,
  vehicleInfo: "",
  marketingAgreed: false,
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

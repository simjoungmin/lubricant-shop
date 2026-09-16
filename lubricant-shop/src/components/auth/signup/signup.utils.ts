import type { SignupFormState } from "./signup.types";

export type SignupPhoneParts = {
  prefix: string;
  first: string;
  second: string;
};

export type SignupPhonePart = keyof SignupPhoneParts;

export const signupPhonePrefixOptions = ["010", "011", "016", "017", "018", "019"];

const phonePartMaxLength: Record<SignupPhonePart, number> = {
  prefix: 3,
  first: 4,
  second: 4,
};

const getOnlyDigits = (value: string) => value.replace(/\D/g, "");

export const getSignupPhoneParts = (phone: SignupFormState["phone"]): SignupPhoneParts => {
  const onlyDigits = getOnlyDigits(phone);

  return {
    prefix: onlyDigits.slice(0, 3) || "010",
    first: onlyDigits.slice(3, 7),
    second: onlyDigits.slice(7, 11),
  };
};

export const getNextSignupPhoneValue = (
  phoneParts: SignupPhoneParts,
  field: SignupPhonePart,
  value: string,
) => {
  const nextPhoneParts = {
    ...phoneParts,
    [field]: getOnlyDigits(value).slice(0, phonePartMaxLength[field]),
  };

  return `${nextPhoneParts.prefix}${nextPhoneParts.first}${nextPhoneParts.second}`;
};

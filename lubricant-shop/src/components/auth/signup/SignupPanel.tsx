"use client";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useSignupForm } from "../use/useSignupForm";
import type { SignupFormState, SignupFormUpdateHandler } from "./signup.types";

type SignupRowProps = {
  label: string;
  children: ReactNode;
  isRequired?: boolean;
  labelClassName?: string;
};

type SignupInputProps = {
  field: keyof SignupFormState;
  form: SignupFormState;
  onChangeField: SignupFormUpdateHandler;
  ariaInvalid?: boolean;
  className?: string;
  inputMode?: "email" | "numeric" | "tel" | "text";
  placeholder?: string;
  type?: "email" | "password" | "text";
};

const inputClassName =
  "h-[30px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]";
const fullInputClassName = `${inputClassName} w-full`;
const mediumInputClassName = `${inputClassName} w-[218px] max-w-full`;
const selectClassName =
  "h-[30px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]";
const helperClassName = "mt-[7px] text-[11px] leading-[16px] text-[#7b8794]";
const errorClassName = "mt-[7px] text-[11px] font-semibold leading-[16px] text-[#d93636]";

const getPhoneParts = (phone: SignupFormState["phone"]) => {
  const onlyNumber = phone.replace(/\D/g, "");

  return {
    prefix: onlyNumber.slice(0, 3) || "010",
    first: onlyNumber.slice(3, 7),
    second: onlyNumber.slice(7, 11),
  };
};

const SignupPanel = () => {
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const {
    signupForm,
    signupErrors,
    emailCheckState,
    signupMessage,
    isSignupSubmitting,
    updateSignupField,
    handleSignupSubmit,
  } = useSignupForm({
    onSignupSuccess: () => setIsSuccessModalOpen(true),
  });
  const phoneParts = useMemo(() => getPhoneParts(signupForm.phone), [signupForm.phone]);
  const isAllAgreed =
    signupForm.termsAgreed &&
    signupForm.privacyAgreed &&
    signupForm.privacyDelegationAgreed &&
    signupForm.marketingAgreed;

  const updatePhone = (field: "prefix" | "first" | "second", value: string) => {
    const nextPhoneParts = {
      ...phoneParts,
      [field]: value.replace(/\D/g, "").slice(0, field === "prefix" ? 3 : 4),
    };

    updateSignupField(
      "phone",
      `${nextPhoneParts.prefix}${nextPhoneParts.first}${nextPhoneParts.second}`,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    void handleSignupSubmit(event);
  };

  const handleAllAgreementChange = (isChecked: boolean) => {
    updateSignupField("termsAgreed", isChecked);
    updateSignupField("privacyAgreed", isChecked);
    updateSignupField("privacyDelegationAgreed", isChecked);
    updateSignupField("marketingAgreed", isChecked);
  };

  return (
    <>
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        title="회원가입 완료"
        message="회원가입이 완료되었습니다. 로그인 후 서비스를 이용해 주세요."
        tone="success"
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.push("/login");
        }}
      />

      <form
        className="mx-auto w-full max-w-[700px] px-[18px] py-[28px] text-[12px] text-[#111]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="mb-[14px] flex items-center justify-between">
          <h1 className="text-[14px] font-bold text-black">회원가입 정보</h1>
          <p className="text-[11px] text-black">
            <span className="text-[#d93636]">*</span> 필수입력사항
          </p>
        </div>

        <section className="border-t border-[#d7d7d7]">
          <SignupRow label="회원구분">
            <div className="flex h-full flex-wrap items-center gap-x-[18px] gap-y-2">
              <label className="inline-flex items-center gap-[5px]">
                <input checked readOnly className="h-[13px] w-[13px] accent-[#222]" type="radio" />
                개인회원
              </label>
              <label className="inline-flex items-center gap-[5px]">
                <input disabled className="h-[13px] w-[13px]" type="radio" />
                사업자회원
              </label>
              <label className="inline-flex items-center gap-[5px]">
                <input disabled className="h-[13px] w-[13px]" type="radio" />
                외국인회원(foreigner)
              </label>
            </div>
          </SignupRow>

          <SignupRow label="회원인증">
            <label className="inline-flex items-center gap-[5px]">
              <input checked readOnly className="h-[13px] w-[13px] accent-[#222]" type="radio" />
              휴대폰인증
            </label>
            <div className="mt-[7px]">
              <button
                className="h-[30px] border border-[#bfbfbf] bg-white px-[14px] text-[12px] text-[#333]"
                type="button"
                disabled
              >
                휴대폰인증
              </button>
            </div>
            <p className={helperClassName}>본인 명의의 휴대폰으로 본인인증을 진행합니다.</p>
          </SignupRow>

          <SignupRow label="이메일" isRequired>
            <SignupInput
              ariaInvalid={Boolean(signupErrors.email || signupErrors.emailCheck)}
              className={mediumInputClassName}
              field="email"
              form={signupForm}
              inputMode="email"
              onChangeField={updateSignupField}
              type="email"
            />
            {emailCheckState === "checking" ? <p className={helperClassName}>이메일 중복 확인 중입니다.</p> : null}
            {signupErrors.email ? <p className={errorClassName}>{signupErrors.email}</p> : null}
            {signupErrors.emailCheck ? <p className={errorClassName}>{signupErrors.emailCheck}</p> : null}
          </SignupRow>

          <SignupRow label="아이디" isRequired>
            <SignupInput
              ariaInvalid={Boolean(signupErrors.loginId)}
              className={mediumInputClassName}
              field="loginId"
              form={signupForm}
              onChangeField={updateSignupField}
            />
            <p className={helperClassName}>(영문소문자/숫자, 4~16자)</p>
            {signupErrors.loginId ? <p className={errorClassName}>{signupErrors.loginId}</p> : null}
          </SignupRow>

          <SignupRow label="비밀번호" isRequired>
            <SignupInput
              ariaInvalid={Boolean(signupErrors.password)}
              className={mediumInputClassName}
              field="password"
              form={signupForm}
              onChangeField={updateSignupField}
              type="password"
            />
            <p className={helperClassName}>(대문자, 소문자, 특수문자를 포함해 8자 이상)</p>
            {signupErrors.password ? <p className={errorClassName}>{signupErrors.password}</p> : null}
          </SignupRow>

          <SignupRow label="비밀번호 확인" isRequired>
            <SignupInput
              ariaInvalid={Boolean(signupErrors.passwordConfirm)}
              className={mediumInputClassName}
              field="passwordConfirm"
              form={signupForm}
              onChangeField={updateSignupField}
              type="password"
            />
            {signupErrors.passwordConfirm ? <p className={errorClassName}>{signupErrors.passwordConfirm}</p> : null}
          </SignupRow>

          <SignupRow label="이름" isRequired>
            <SignupInput
              ariaInvalid={Boolean(signupErrors.name)}
              className={mediumInputClassName}
              field="name"
              form={signupForm}
              onChangeField={updateSignupField}
            />
            {signupErrors.name ? <p className={errorClassName}>{signupErrors.name}</p> : null}
          </SignupRow>

          <SignupRow label="주소" isRequired labelClassName="min-h-[122px]">
            <div className="grid gap-[8px]">
              <div className="flex flex-wrap items-center gap-[6px]">
                <SignupInput
                  className="h-[30px] w-[150px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[12px] text-[#111] outline-none"
                  field="postalCode"
                  form={signupForm}
                  inputMode="numeric"
                  onChangeField={updateSignupField}
                  placeholder="우편번호"
                />
                <button
                  className="h-[30px] border border-[#aaa] bg-white px-[14px] text-[12px] text-[#333]"
                  type="button"
                  disabled
                >
                  주소검색
                </button>
              </div>
              <SignupInput
                ariaInvalid={Boolean(signupErrors.address)}
                className="h-[30px] w-full max-w-[368px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[12px] text-[#111] outline-none focus:border-[#777] aria-[invalid=true]:border-red-400"
                field="address"
                form={signupForm}
                onChangeField={updateSignupField}
                placeholder="기본주소"
              />
              <SignupInput
                className="h-[30px] w-full max-w-[368px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]"
                field="detailAddress"
                form={signupForm}
                onChangeField={updateSignupField}
                placeholder="나머지 주소"
              />
              {signupErrors.address ? <p className={errorClassName}>{signupErrors.address}</p> : null}
            </div>
          </SignupRow>

          <SignupRow label="휴대전화" isRequired>
            <PhoneNumberFields
              ariaInvalid={Boolean(signupErrors.phone)}
              first={phoneParts.first}
              onChangeFirst={(value) => updatePhone("first", value)}
              onChangePrefix={(value) => updatePhone("prefix", value)}
              onChangeSecond={(value) => updatePhone("second", value)}
              prefix={phoneParts.prefix}
              prefixOptions={["010", "011", "016", "017", "018", "019"]}
              second={phoneParts.second}
            />
            {signupErrors.phone ? <p className={errorClassName}>{signupErrors.phone}</p> : null}
          </SignupRow>
        </section>

        <section className="mt-[34px]">
          <h2 className="text-[16px] font-bold text-black">전체 동의</h2>
          <div className="mt-[14px] border-t border-[#dedede]">
            <label className="flex min-h-[58px] items-center gap-[8px] border-b border-[#dedede] py-[8px]">
              <AgreementCheckbox
                checked={isAllAgreed}
                onChange={handleAllAgreementChange}
              />
              <span>
                <span className="block text-[14px] font-bold text-black">
                  모든 약관을 확인하고 전체 동의합니다.
                </span>
                <span className="mt-[2px] block text-[12px] text-[#7b8794]">
                  (전체 동의는 필수 및 선택 정보에 대한 동의가 포함되어 있습니다.)
                </span>
              </span>
            </label>

            <AgreementItem
              checked={signupForm.termsAgreed}
              label="[필수] 이용약관 동의"
              onChange={(isChecked) => updateSignupField("termsAgreed", isChecked)}
            />
            {signupErrors.termsAgreed ? <p className={errorClassName}>{signupErrors.termsAgreed}</p> : null}

            <AgreementItem
              checked={signupForm.privacyAgreed}
              label="[필수] 개인정보 수집 및 이용 동의"
              onChange={(isChecked) => updateSignupField("privacyAgreed", isChecked)}
            />
            {signupErrors.privacyAgreed ? <p className={errorClassName}>{signupErrors.privacyAgreed}</p> : null}

            <AgreementItem
              checked={signupForm.privacyDelegationAgreed}
              label="[선택] 개인정보 처리 위탁 동의"
              onChange={(isChecked) => updateSignupField("privacyDelegationAgreed", isChecked)}
            />

            <AgreementItem
              checked={signupForm.marketingAgreed}
              label="[선택] 쇼핑정보 수신 동의"
              onChange={(isChecked) => updateSignupField("marketingAgreed", isChecked)}
            />

          </div>
        </section>

        {signupMessage || signupErrors.submit ? (
          <p className="mt-[12px] border border-[#f2c4b8] bg-[#fff6f2] px-[10px] py-[8px] text-[12px] font-semibold text-[#333]">
            {signupErrors.submit || signupMessage}
          </p>
        ) : null}

        <div className="mt-[20px] flex justify-center gap-[8px]">
          <button
            className="h-[34px] min-w-[96px] border border-[#333] bg-[#333] px-[18px] text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSignupSubmitting}
            type="submit"
          >
            {isSignupSubmitting ? "가입 처리 중..." : "회원가입"}
          </button>
          <Link
            className="inline-flex h-[34px] min-w-[80px] items-center justify-center border border-[#999] bg-white px-[18px] text-[12px] font-bold text-[#333]"
            href="/login"
          >
            취소
          </Link>
        </div>
      </form>
    </>
  );
};

function SignupRow({ label, children, isRequired = false, labelClassName = "" }: SignupRowProps) {
  return (
    <div className="grid border-b border-[#dedede] md:grid-cols-[126px_minmax(0,1fr)]">
      <div className={`flex items-center bg-[#f7f7f7] px-[12px] py-[10px] text-[11px] font-bold text-black ${labelClassName}`}>
        {label} {isRequired ? <span className="ml-[2px] text-[#d93636]">*</span> : null}
      </div>
      <div className="min-w-0 px-[16px] py-[8px]">{children}</div>
    </div>
  );
}

function SignupInput({
  field,
  form,
  onChangeField,
  ariaInvalid = false,
  className = fullInputClassName,
  inputMode = "text",
  placeholder,
  type = "text",
}: SignupInputProps) {
  return (
    <input
      aria-invalid={ariaInvalid}
      className={className}
      inputMode={inputMode}
      placeholder={placeholder}
      type={type}
      value={String(form[field])}
      onChange={(event) => onChangeField(field, event.target.value)}
    />
  );
}

function PhoneNumberFields({
  ariaInvalid = false,
  first,
  onChangeFirst,
  onChangePrefix,
  onChangeSecond,
  prefix,
  prefixOptions,
  second,
}: {
  ariaInvalid?: boolean;
  first: string;
  onChangeFirst: (value: string) => void;
  onChangePrefix: (value: string) => void;
  onChangeSecond: (value: string) => void;
  prefix: string;
  prefixOptions: string[];
  second: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      <select
        className={`${selectClassName} w-[64px]`}
        value={prefix}
        onChange={(event) => onChangePrefix(event.target.value)}
      >
        {prefixOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-[#777]">-</span>
      <input
        aria-invalid={ariaInvalid}
        className={`${inputClassName} w-[64px] aria-[invalid=true]:border-red-400`}
        inputMode="numeric"
        value={first}
        onChange={(event) => onChangeFirst(event.target.value.replace(/\D/g, "").slice(0, 4))}
      />
      <span className="text-[#777]">-</span>
      <input
        aria-invalid={ariaInvalid}
        className={`${inputClassName} w-[64px] aria-[invalid=true]:border-red-400`}
        inputMode="numeric"
        value={second}
        onChange={(event) => onChangeSecond(event.target.value.replace(/\D/g, "").slice(0, 4))}
      />
    </div>
  );
}

function AgreementItem({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <label className="flex min-h-[46px] items-center justify-between gap-[12px] border-b border-[#dedede] py-[7px]">
      <span className="inline-flex items-center gap-[8px]">
        <AgreementCheckbox checked={checked} onChange={onChange} />
        <span className="text-[13px] font-bold text-black">{label}</span>
      </span>
      <span className="pr-[2px] text-[18px] leading-none text-black">⌄</span>
    </label>
  );
}

function AgreementCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <input
      checked={checked}
      className="h-[16px] w-[16px] rounded-full border border-[#cfd4da] accent-[#333]"
      type="checkbox"
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}

export default SignupPanel;

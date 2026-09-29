import Link from "next/link";
import type { ReactNode } from "react";
import type {
  EmailCheckState,
  PhoneVerificationState,
  SignupErrors,
  SignupFormState,
  SignupFormUpdateHandler,
} from "./signup.types";
import {
  signupPhonePrefixOptions,
  type SignupPhonePart,
  type SignupPhoneParts,
} from "./signup.utils";

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
  ariaLabel?: string;
  ariaInvalid?: boolean;
  className?: string;
  inputMode?: "email" | "numeric" | "tel" | "text";
  placeholder?: string;
  readOnly?: boolean;
  type?: "email" | "password" | "text";
};

type SignupAccountRowsProps = {
  emailCheckState: EmailCheckState;
  errors: SignupErrors;
  form: SignupFormState;
  onChangeField: SignupFormUpdateHandler;
};

type SignupAddressRowProps = {
  errors: SignupErrors;
  form: SignupFormState;
  onChangeField: SignupFormUpdateHandler;
  onSearchAddress: () => void;
};

type PhoneVerificationFieldsProps = {
  error?: string;
  verificationCode: string;
  verificationError?: string;
  verificationMessage: string;
  verificationState: PhoneVerificationState;
  isSending: boolean;
  isConfirming: boolean;
  phoneParts: SignupPhoneParts;
  onChangePhonePart: (field: SignupPhonePart, value: string) => void;
  onChangeVerificationCode: (value: string) => void;
  onConfirmVerification: () => void;
  onSendVerificationCode: () => void;
};

type SignupFixedInfoRowsProps = Omit<PhoneVerificationFieldsProps, "error"> & {
  phoneError?: string;
};

type SignupAgreementRowsProps = {
  errors: SignupErrors;
  form: SignupFormState;
  isAllAgreed: boolean;
  onChangeAllAgreements: (isChecked: boolean) => void;
  onChangeField: SignupFormUpdateHandler;
};

type SignupSubmitActionsProps = {
  isSubmitting: boolean;
};

export const helperClassName = "mt-[7px] text-[11px] leading-[16px] text-[#7b8794]";
export const errorClassName =
  "mt-[7px] text-[11px] font-semibold leading-[16px] text-[#d93636]";

const inputClassName =
  "h-[30px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]";
const fullInputClassName = `${inputClassName} w-full`;
const mediumInputClassName = `${inputClassName} w-[218px] max-w-full`;
const selectClassName =
  "h-[30px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]";

export function SignupFormHeader() {
  return (
    <div className="mb-[14px] flex items-center justify-between">
      <h1 className="text-[14px] font-bold text-black">회원가입 정보</h1>
      <p className="text-[11px] text-black">
        <span className="text-[#d93636]">*</span> 필수입력사항
      </p>
    </div>
  );
}

export function SignupFixedInfoRows({
  phoneError,
  verificationCode,
  verificationError,
  verificationMessage,
  verificationState,
  isSending,
  isConfirming,
  phoneParts,
  onChangePhonePart,
  onChangeVerificationCode,
  onConfirmVerification,
  onSendVerificationCode,
}: SignupFixedInfoRowsProps) {
  return (
    <>
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
        <p className={helperClassName}>본인 명의의 휴대폰으로 본인인증을 진행합니다.</p>
        <div className="mt-[8px]">
          <PhoneVerificationFields
            error={phoneError}
            verificationCode={verificationCode}
            verificationError={verificationError}
            verificationMessage={verificationMessage}
            verificationState={verificationState}
            isSending={isSending}
            isConfirming={isConfirming}
            phoneParts={phoneParts}
            onChangePhonePart={onChangePhonePart}
            onChangeVerificationCode={onChangeVerificationCode}
            onConfirmVerification={onConfirmVerification}
            onSendVerificationCode={onSendVerificationCode}
          />
        </div>
      </SignupRow>
    </>
  );
}

export function SignupAccountRows({
  emailCheckState,
  errors,
  form,
  onChangeField,
}: SignupAccountRowsProps) {
  return (
    <>
      <SignupRow label="이메일" isRequired>
        <SignupInput
          ariaLabel="이메일"
          ariaInvalid={Boolean(errors.email || errors.emailCheck)}
          className={mediumInputClassName}
          field="email"
          form={form}
          inputMode="email"
          onChangeField={onChangeField}
          type="email"
        />
        {emailCheckState === "checking" ? (
          <p className={helperClassName}>이메일 중복 확인 중입니다.</p>
        ) : null}
        {errors.email ? <p className={errorClassName}>{errors.email}</p> : null}
        {errors.emailCheck ? <p className={errorClassName}>{errors.emailCheck}</p> : null}
      </SignupRow>

      <SignupRow label="아이디" isRequired>
        <SignupInput
          ariaLabel="아이디"
          ariaInvalid={Boolean(errors.loginId)}
          className={mediumInputClassName}
          field="loginId"
          form={form}
          onChangeField={onChangeField}
        />
        <p className={helperClassName}>(영문소문자/숫자, 4~16자)</p>
        {errors.loginId ? <p className={errorClassName}>{errors.loginId}</p> : null}
      </SignupRow>

      <SignupRow label="비밀번호" isRequired>
        <SignupInput
          ariaLabel="비밀번호"
          ariaInvalid={Boolean(errors.password)}
          className={mediumInputClassName}
          field="password"
          form={form}
          onChangeField={onChangeField}
          type="password"
        />
        <p className={helperClassName}>(대문자, 소문자, 특수문자를 포함해 8자 이상)</p>
        {errors.password ? <p className={errorClassName}>{errors.password}</p> : null}
      </SignupRow>

      <SignupRow label="비밀번호 확인" isRequired>
        <SignupInput
          ariaLabel="비밀번호 확인"
          ariaInvalid={Boolean(errors.passwordConfirm)}
          className={mediumInputClassName}
          field="passwordConfirm"
          form={form}
          onChangeField={onChangeField}
          type="password"
        />
        {errors.passwordConfirm ? (
          <p className={errorClassName}>{errors.passwordConfirm}</p>
        ) : null}
      </SignupRow>

      <SignupRow label="이름" isRequired>
        <SignupInput
          ariaLabel="이름"
          ariaInvalid={Boolean(errors.name)}
          className={mediumInputClassName}
          field="name"
          form={form}
          onChangeField={onChangeField}
        />
        {errors.name ? <p className={errorClassName}>{errors.name}</p> : null}
      </SignupRow>
    </>
  );
}

export function SignupAddressRow({
  errors,
  form,
  onChangeField,
  onSearchAddress,
}: SignupAddressRowProps) {
  return (
    <SignupRow label="주소" isRequired labelClassName="min-h-[122px]">
      <div className="grid gap-[8px]">
        <div className="flex flex-wrap items-center gap-[6px]">
          <SignupInput
            ariaLabel="우편번호"
            className="h-[30px] w-[150px] cursor-not-allowed border border-[#d9d9d9] bg-[#f5f5f5] px-3 text-[12px] text-[#111] outline-none"
            field="postalCode"
            form={form}
            inputMode="numeric"
            onChangeField={onChangeField}
            placeholder="우편번호"
            readOnly
          />
          <button
            className="h-[30px] border border-[#aaa] bg-white px-[14px] text-[12px] text-[#333]"
            type="button"
            onClick={onSearchAddress}
          >
            주소검색
          </button>
        </div>
        <SignupInput
          ariaLabel="주소"
          ariaInvalid={Boolean(errors.address)}
          className="h-[30px] w-full max-w-[368px] cursor-not-allowed border border-[#d9d9d9] bg-[#f5f5f5] px-3 text-[12px] text-[#111] outline-none aria-[invalid=true]:border-red-400"
          field="address"
          form={form}
          onChangeField={onChangeField}
          placeholder="주소검색으로 입력해 주세요"
          readOnly
        />
        <SignupInput
          ariaLabel="나머지 주소"
          className="h-[30px] w-full max-w-[368px] border border-[#d9d9d9] bg-white px-3 text-[12px] text-[#111] outline-none focus:border-[#777]"
          field="detailAddress"
          form={form}
          onChangeField={onChangeField}
          placeholder="나머지 주소"
        />
        {errors.address ? <p className={errorClassName}>{errors.address}</p> : null}
      </div>
    </SignupRow>
  );
}

function PhoneVerificationFields({
  error,
  verificationCode,
  verificationError,
  verificationMessage,
  verificationState,
  isSending,
  isConfirming,
  phoneParts,
  onChangePhonePart,
  onChangeVerificationCode,
  onConfirmVerification,
  onSendVerificationCode,
}: PhoneVerificationFieldsProps) {
  const isVerified = verificationState === "verified";

  return (
    <>
      <div className="grid gap-[8px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <PhoneNumberFields
            ariaInvalid={Boolean(error)}
            first={phoneParts.first}
            onChangeFirst={(value) => onChangePhonePart("first", value)}
            onChangePrefix={(value) => onChangePhonePart("prefix", value)}
            onChangeSecond={(value) => onChangePhonePart("second", value)}
            prefix={phoneParts.prefix}
            second={phoneParts.second}
          />
          <button
            className="h-[30px] border border-[#aaa] bg-white px-[12px] text-[12px] font-bold text-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending || isVerified}
            type="button"
            onClick={onSendVerificationCode}
          >
            {isSending ? "발송 중" : isVerified ? "인증 완료" : "인증번호 발송"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-[8px]">
          <input
            aria-label="휴대전화 인증번호"
            aria-invalid={Boolean(verificationError)}
            className={`${inputClassName} w-[132px] aria-[invalid=true]:border-red-400`}
            inputMode="numeric"
            placeholder="인증번호 6자리"
            value={verificationCode}
            onChange={(event) => onChangeVerificationCode(event.target.value)}
          />
          <button
            className="h-[30px] border border-[#333] bg-[#333] px-[12px] text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isConfirming || isVerified || verificationCode.length !== 6}
            type="button"
            onClick={onConfirmVerification}
          >
            {isConfirming ? "확인 중" : "인증 확인"}
          </button>
        </div>
      </div>
      {error ? <p className={errorClassName}>{error}</p> : null}
      {verificationError ? <p className={errorClassName}>{verificationError}</p> : null}
      {verificationMessage ? (
        <p className={`${helperClassName} ${isVerified ? "text-emerald-600" : ""}`}>
          {verificationMessage}
        </p>
      ) : null}
    </>
  );
}

export function SignupAgreementRows({
  errors,
  form,
  isAllAgreed,
  onChangeAllAgreements,
  onChangeField,
}: SignupAgreementRowsProps) {
  return (
    <section className="mt-[34px]">
      <h2 className="text-[16px] font-bold text-black">전체 동의</h2>
      <div className="mt-[14px] border-t border-[#dedede]">
        <label className="flex min-h-[58px] items-center gap-[8px] border-b border-[#dedede] py-[8px]">
          <AgreementCheckbox checked={isAllAgreed} onChange={onChangeAllAgreements} />
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
          checked={form.termsAgreed}
          label="[필수] 이용약관 동의"
          onChange={(isChecked) => onChangeField("termsAgreed", isChecked)}
        />
        {errors.termsAgreed ? <p className={errorClassName}>{errors.termsAgreed}</p> : null}

        <AgreementItem
          checked={form.privacyAgreed}
          label="[필수] 개인정보 수집 및 이용 동의"
          onChange={(isChecked) => onChangeField("privacyAgreed", isChecked)}
        />
        {errors.privacyAgreed ? <p className={errorClassName}>{errors.privacyAgreed}</p> : null}

        <AgreementItem
          checked={form.privacyDelegationAgreed}
          label="[선택] 개인정보 처리 위탁 동의"
          onChange={(isChecked) => onChangeField("privacyDelegationAgreed", isChecked)}
        />

        <AgreementItem
          checked={form.marketingAgreed}
          label="[선택] 쇼핑정보 수신 동의"
          onChange={(isChecked) => onChangeField("marketingAgreed", isChecked)}
        />
      </div>
    </section>
  );
}

export function SignupFeedbackMessage({
  message,
}: {
  message: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-[12px] border border-[#f2c4b8] bg-[#fff6f2] px-[10px] py-[8px] text-[12px] font-semibold text-[#333]">
      {message}
    </p>
  );
}

export function SignupSubmitActions({ isSubmitting }: SignupSubmitActionsProps) {
  return (
    <div className="mt-[20px] flex justify-center gap-[8px]">
      <button
        className="h-[34px] min-w-[96px] border border-[#333] bg-[#333] px-[18px] text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "가입 처리 중..." : "회원가입"}
      </button>
      <Link
        className="inline-flex h-[34px] min-w-[80px] items-center justify-center border border-[#999] bg-white px-[18px] text-[12px] font-bold text-[#333]"
        href="/login"
      >
        취소
      </Link>
    </div>
  );
}

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
  ariaLabel,
  ariaInvalid = false,
  className = fullInputClassName,
  inputMode = "text",
  placeholder,
  readOnly = false,
  type = "text",
}: SignupInputProps) {
  return (
    <input
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      className={className}
      inputMode={inputMode}
      placeholder={placeholder}
      readOnly={readOnly}
      type={type}
      value={String(form[field])}
      onChange={(event) => {
        if (!readOnly) {
          onChangeField(field, event.target.value);
        }
      }}
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
  second,
}: {
  ariaInvalid?: boolean;
  first: string;
  onChangeFirst: (value: string) => void;
  onChangePrefix: (value: string) => void;
  onChangeSecond: (value: string) => void;
  prefix: string;
  second: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      <select
        className={`${selectClassName} w-[64px]`}
        value={prefix}
        onChange={(event) => onChangePrefix(event.target.value)}
      >
        {signupPhonePrefixOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-[#777]">-</span>
      <input
        aria-label="휴대전화 앞자리"
        aria-invalid={ariaInvalid}
        className={`${inputClassName} w-[64px] aria-[invalid=true]:border-red-400`}
        inputMode="numeric"
        value={first}
        onChange={(event) => onChangeFirst(event.target.value.replace(/\D/g, "").slice(0, 4))}
      />
      <span className="text-[#777]">-</span>
      <input
        aria-label="휴대전화 뒷자리"
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

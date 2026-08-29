"use client";

import { useSignupForm } from "../use/useSignupForm";
import { SignupAgreementSection } from "./SignupAgreementSection";
import { SignupEmailField } from "./SignupEmailField";
import { SignupOptionalSection } from "./SignupOptionalSection";
import { SignupPasswordFields } from "./SignupPasswordFields";
import { SignupProfileFields } from "./SignupProfileFields";

type SignupPanelProps = {
  onLoginClick: () => void;
  onSignupSuccess: () => void;
};

const SignupPanel = ({ onLoginClick, onSignupSuccess }: SignupPanelProps) => {
  const {
    signupForm,
    signupErrors,
    emailCheckState,
    signupMessage,
    isSignupSubmitting,
    updateSignupField,
    handleEmailCheck,
    handleSignupSubmit,
  } = useSignupForm({ onSignupSuccess });

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-black text-white">회원가입</h2>
        <p className="mt-2 text-sm text-zinc-400">
          필수 정보를 입력하고 약관 동의를 완료해 주세요.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSignupSubmit} noValidate>
        <SignupEmailField
          email={signupForm.email}
          errors={signupErrors}
          emailCheckState={emailCheckState}
          onChangeField={updateSignupField}
          onCheckEmail={() => void handleEmailCheck()}
        />
        <SignupPasswordFields
          form={signupForm}
          errors={signupErrors}
          onChangeField={updateSignupField}
        />
        <SignupProfileFields
          form={signupForm}
          errors={signupErrors}
          onChangeField={updateSignupField}
        />
        <SignupAgreementSection
          form={signupForm}
          errors={signupErrors}
          onChangeField={updateSignupField}
        />
        <SignupOptionalSection form={signupForm} onChangeField={updateSignupField} />

        {signupMessage || signupErrors.submit ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm font-bold ${
              signupErrors.submit
                ? "border-red-400/30 bg-red-500/10 text-red-200"
                : "border-white/10 bg-black/20 text-zinc-200"
            }`}
          >
            {signupErrors.submit || signupMessage}
          </p>
        ) : null}

        <button
          className="h-12 w-full rounded-md bg-[#d6a84f] text-sm font-black text-black transition hover:bg-[#f0c76a] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSignupSubmitting}
          type="submit"
        >
          {isSignupSubmitting ? "가입 처리 중..." : "회원가입 완료"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        이미 계정이 있으신가요?{" "}
        <button
          className="font-bold text-[#d6a84f] hover:text-white"
          type="button"
          onClick={onLoginClick}
        >
          로그인
        </button>
      </p>
    </>
  );
};

export default SignupPanel;

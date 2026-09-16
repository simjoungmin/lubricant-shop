"use client";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useSignupForm } from "../use/useSignupForm";
import {
  SignupAccountRows,
  SignupAddressRow,
  SignupAgreementRows,
  SignupFeedbackMessage,
  SignupFixedInfoRows,
  SignupFormHeader,
  SignupPhoneRow,
  SignupSubmitActions,
} from "./SignupPanelSections";
import { getNextSignupPhoneValue, getSignupPhoneParts, type SignupPhonePart } from "./signup.utils";
import { useJusoAddressSearch, type JusoSelectedAddress } from "./useJusoAddressSearch";

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
  const phoneParts = useMemo(() => getSignupPhoneParts(signupForm.phone), [signupForm.phone]);
  const isAllAgreed =
    signupForm.termsAgreed &&
    signupForm.privacyAgreed &&
    signupForm.privacyDelegationAgreed &&
    signupForm.marketingAgreed;
  const feedbackMessage = signupErrors.submit || signupMessage;

  const handleAddressSelected = useCallback(
    ({ postalCode, address, detailAddress }: JusoSelectedAddress) => {
      updateSignupField("postalCode", postalCode);
      updateSignupField("address", address);

      if (detailAddress) {
        updateSignupField("detailAddress", detailAddress);
      }
    },
    [updateSignupField],
  );

  const handleSearchAddress = useJusoAddressSearch({
    onAddressSelected: handleAddressSelected,
  });

  const updatePhone = (field: SignupPhonePart, value: string) => {
    updateSignupField("phone", getNextSignupPhoneValue(phoneParts, field, value));
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
        <SignupFormHeader />

        <section className="border-t border-[#d7d7d7]">
          <SignupFixedInfoRows />
          <SignupAccountRows
            emailCheckState={emailCheckState}
            errors={signupErrors}
            form={signupForm}
            onChangeField={updateSignupField}
          />
          <SignupAddressRow
            errors={signupErrors}
            form={signupForm}
            onChangeField={updateSignupField}
            onSearchAddress={handleSearchAddress}
          />
          <SignupPhoneRow
            error={signupErrors.phone}
            phoneParts={phoneParts}
            onChangePhonePart={updatePhone}
          />
        </section>

        <SignupAgreementRows
          errors={signupErrors}
          form={signupForm}
          isAllAgreed={isAllAgreed}
          onChangeAllAgreements={handleAllAgreementChange}
          onChangeField={updateSignupField}
        />

        <SignupFeedbackMessage message={feedbackMessage} />
        <SignupSubmitActions isSubmitting={isSignupSubmitting} />
      </form>
    </>
  );
};

export default SignupPanel;

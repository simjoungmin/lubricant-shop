import type { InquiryTopic } from "@/assets/inquiry-categories";
import type { AuthUser } from "@/components/auth/auth/auth.types";
import type {
  InquiryFormChangeHandler,
  InquiryFormErrors,
  InquiryFormValues,
} from "@/components/customer/inquiry-form.types";
import type { ChangeEvent } from "react";
import { InquiryAttachmentField } from "./InquiryAttachmentField";
import { InquiryContactFields } from "./InquiryContactFields";
import { InquiryContentFields } from "./InquiryContentFields";
import { InquiryPrivacyField } from "./InquiryPrivacyField";
import { InquirySubmitBar } from "./InquirySubmitBar";

type InquiryFormFieldsProps = {
  values: InquiryFormValues;
  errors: InquiryFormErrors;
  user: AuthUser;
  selectedTopic: InquiryTopic;
  attachments: File[];
  attachmentSummary: string;
  submitMessage: string;
  isSubmitting: boolean;
  onChangeValue: InquiryFormChangeHandler;
  onChangeAttachments: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InquiryFormFields({
  values,
  errors,
  user,
  selectedTopic,
  attachments,
  attachmentSummary,
  submitMessage,
  isSubmitting,
  onChangeValue,
  onChangeAttachments,
}: InquiryFormFieldsProps) {
  return (
    <>
      <InquiryContactFields
        values={values}
        errors={errors}
        user={user}
        onChangeValue={onChangeValue}
      />
      <InquiryContentFields
        values={values}
        errors={errors}
        selectedTopic={selectedTopic}
        onChangeValue={onChangeValue}
      />
      <InquiryAttachmentField
        attachments={attachments}
        attachmentSummary={attachmentSummary}
        onChangeAttachments={onChangeAttachments}
      />
      <InquiryPrivacyField
        isChecked={values.privacyAgreed}
        error={errors.privacyAgreed}
        onChange={(isChecked) => onChangeValue("privacyAgreed", isChecked)}
      />
      <InquirySubmitBar submitMessage={submitMessage} isSubmitting={isSubmitting} />
    </>
  );
}

import type { InquiryTopic } from "@/assets/inquiry-categories";
import {
  type InquiryFormChangeHandler,
  type InquiryFormErrors,
  type InquiryFormValues,
  inquiryErrorClassName,
} from "./inquiry-form.types";
import { InquiryTextInput } from "./InquiryTextInput";

type InquiryContentFieldsProps = {
  values: InquiryFormValues;
  errors: InquiryFormErrors;
  selectedTopic: InquiryTopic;
  onChangeValue: InquiryFormChangeHandler;
};

export function InquiryContentFields({
  values,
  errors,
  selectedTopic,
  onChangeValue,
}: InquiryContentFieldsProps) {
  return (
    <>
      <InquiryTextInput
        label="제목"
        placeholder="문의 제목을 입력해 주세요"
        value={values.title}
        error={errors.title}
        onChange={(value) => onChangeValue("title", value)}
      />

      <label className="grid gap-2 text-sm font-bold text-[#34465c]">
        문의 내용
        <textarea
          className="min-h-56 rounded-md border border-[#dce2e8] bg-white px-4 py-4 text-sm font-semibold leading-6 text-[#071d3b] outline-none transition placeholder:text-[#a4adb8] focus:border-[#ff4b1f]"
          placeholder={`문의 내용을 자세히 적어주세요.\n\n선택한 문의: ${selectedTopic.label}\n필요 정보: ${selectedTopic.helper}`}
          value={values.content}
          onChange={(event) => onChangeValue("content", event.target.value)}
          aria-invalid={Boolean(errors.content)}
        />
        {errors.content ? <span className={inquiryErrorClassName}>{errors.content}</span> : null}
      </label>
    </>
  );
}

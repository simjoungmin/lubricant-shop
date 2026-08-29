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

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        문의 내용
        <textarea
          className="min-h-56 rounded-md border border-white/10 bg-[#11100d] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d6a84f]"
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

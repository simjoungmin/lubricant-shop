"use client";

import type { InquiryCategory, InquiryGroup, InquiryTopic } from "@/assets/inquiry-categories";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { InquiryFormFields } from "@/components/customer/InquiryFormFields";
import {
  type InquiryFormErrors,
  type InquiryFormValues,
  initialInquiryFormValues,
} from "@/components/customer/inquiry-form.types";
import { inquiryApi } from "@/components/customer/inquiry.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";

type InquiryFormProps = {
  selectedCategory: InquiryCategory;
  selectedGroup: InquiryGroup;
  selectedTopic: InquiryTopic;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryForm({
  selectedCategory,
  selectedGroup,
  selectedTopic,
}: InquiryFormProps) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<InquiryFormValues>(initialInquiryFormValues);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const attachmentSummary = useMemo(() => {
    const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);
    return `${attachments.length}개 파일, ${(totalSize / 1024 / 1024).toFixed(2)}MB`;
  }, [attachments]);

  const updateValue = <Key extends keyof InquiryFormValues>(
    key: Key,
    value: InquiryFormValues[Key],
  ) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
    setSubmitMessage("");
  };

  const validateForm = () => {
    const nextErrors: InquiryFormErrors = {};
    const contactName = values.name.trim() || user?.name || "";
    const contactEmail = values.email.trim() || user?.email || "";

    if (!contactName) {
      nextErrors.name = "이름을 입력해주세요.";
    }

    if (!contactEmail) {
      nextErrors.email = "이메일을 입력해주세요.";
    } else if (!emailPattern.test(contactEmail)) {
      nextErrors.email = "올바른 이메일 형식으로 입력해주세요.";
    }

    if (!values.title.trim()) {
      nextErrors.title = "문의 제목을 입력해주세요.";
    }

    if (!values.content.trim()) {
      nextErrors.content = "문의 내용을 입력해주세요.";
    } else if (values.content.trim().length < 10) {
      nextErrors.content = "문의 내용은 10자 이상 입력해주세요.";
    }

    if (!values.privacyAgreed) {
      nextErrors.privacyAgreed = "개인정보 수집 및 이용에 동의해주세요.";
    }

    return nextErrors;
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setAttachments(files);
    setErrors((currentErrors) => ({ ...currentErrors, attachments: undefined }));
    setSubmitMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setSubmitMessage("로그인 후 문의를 접수할 수 있습니다.");
      return;
    }

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("필수 입력값을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await inquiryApi.create({
        title: values.title.trim(),
        content: values.content.trim(),
        contactName: values.name.trim() || user.name,
        contactEmail: values.email.trim() || user.email,
        inquiryCategory: selectedCategory.label,
        inquiryGroup: selectedGroup.label,
        inquiryTopic: selectedTopic.label,
        orderNumber: values.orderNumber.trim() || undefined,
      });

      setValues({ ...initialInquiryFormValues });
      setAttachments([]);
      router.push("/?notice=inquiry-created");
      setSubmitMessage("문의가 접수되었습니다. 관리자 문의 확인창에서 확인할 수 있습니다.");
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "문의 접수에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-[#dde2e8] bg-white p-6">
      <div className="mb-6">
        <p className="text-sm font-black text-[#ff4b1f]">문의 입력</p>
        <h2 className="mt-2 text-2xl font-black text-[#071d3b]">
          {selectedCategory.label} / {selectedGroup.label} / {selectedTopic.label}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#65717f]">{selectedTopic.helper}</p>
      </div>

      {isReady && !user ? <InquiryLoginNotice /> : null}

      {user ? (
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <InquiryFormFields
            values={values}
            errors={errors}
            user={user}
            selectedTopic={selectedTopic}
            attachments={attachments}
            attachmentSummary={attachmentSummary}
            submitMessage={submitMessage}
            isSubmitting={isSubmitting}
            onChangeValue={updateValue}
            onChangeAttachments={handleAttachmentChange}
          />
        </form>
      ) : null}
    </section>
  );
}

function InquiryLoginNotice() {
  return (
    <div className="mb-6 rounded-md border border-[#ffd3c5] bg-[#fff3ef] p-4">
      <p className="text-sm font-bold text-[#071d3b]">
        로그인 후 문의를 접수하면 회원 정보와 연결되어 저장됩니다.
      </p>
      <Link
        href="/login"
        className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-[#ff4b1f] px-4 text-sm font-black text-white transition hover:bg-[#e63e16]"
      >
        로그인하러 가기
      </Link>
    </div>
  );
}

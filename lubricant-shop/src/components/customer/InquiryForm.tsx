"use client";

import type { InquiryCategory, InquiryGroup, InquiryTopic } from "@/assets/inquiry-categories";
import { useAuth } from "@/components/auth/auth/AuthContext";
import { inquiryApi } from "@/components/customer/inquiry.api";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";

type InquiryFormProps = {
  selectedCategory: InquiryCategory;
  selectedGroup: InquiryGroup;
  selectedTopic: InquiryTopic;
};

type InquiryFormValues = {
  name: string;
  email: string;
  orderNumber: string;
  vehicleInfo: string;
  title: string;
  content: string;
  privacyAgreed: boolean;
};

type InquiryFormErrors = Partial<Record<keyof InquiryFormValues | "attachments", string>>;

const initialFormValues: InquiryFormValues = {
  name: "",
  email: "",
  orderNumber: "",
  vehicleInfo: "",
  title: "",
  content: "",
  privacyAgreed: false,
};

const inputClassName =
  "h-12 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d6a84f]";

const errorClassName = "text-xs font-bold text-red-300";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryForm({
  selectedCategory,
  selectedGroup,
  selectedTopic,
}: InquiryFormProps) {
  const { user, isReady } = useAuth();
  const [values, setValues] = useState<InquiryFormValues>(initialFormValues);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const attachmentSummary = useMemo(() => {
    const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);
    return `${attachments.length}개 파일, ${(totalSize / 1024 / 1024).toFixed(2)}MB`;
  }, [attachments]);

  const updateValue = <K extends keyof InquiryFormValues>(
    key: K,
    value: InquiryFormValues[K],
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
        vehicleInfo: values.vehicleInfo.trim() || undefined,
      });

      setValues({
        ...initialFormValues,
      });
      setAttachments([]);
      setSubmitMessage("문의가 접수되었습니다. 관리자 문의 확인창에서 확인할 수 있습니다.");
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "문의 접수에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-6">
      <div className="mb-6">
        <p className="text-sm font-black text-[#d6a84f]">문의 입력</p>
        <h2 className="mt-2 text-2xl font-black text-white">
          {selectedCategory.label} / {selectedGroup.label} / {selectedTopic.label}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{selectedTopic.helper}</p>
      </div>

      {isReady && !user ? (
        <div className="mb-6 rounded-md border border-[#d6a84f]/30 bg-[#d6a84f]/10 p-4">
          <p className="text-sm font-bold text-zinc-200">
            로그인 후 문의를 접수하면 회원 정보와 연결되어 저장됩니다.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-[#d6a84f] px-4 text-sm font-black text-black transition hover:bg-[#efc769]"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            이름
            <input
              className={inputClassName}
              placeholder="이름을 입력해주세요"
              type="text"
              value={values.name || user?.name || ""}
              onChange={(event) => updateValue("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <span className={errorClassName}>{errors.name}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            이메일
            <input
              className={inputClassName}
              placeholder="reply@example.com"
              type="email"
              value={values.email || user?.email || ""}
              onChange={(event) => updateValue("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <span className={errorClassName}>{errors.email}</span> : null}
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            주문번호
            <input
              className={inputClassName}
              placeholder="주문 후 문의라면 입력해주세요"
              type="text"
              value={values.orderNumber}
              onChange={(event) => updateValue("orderNumber", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-200">
            차량 정보
            <input
              className={inputClassName}
              placeholder="예: 2022 그랜저 2.5 가솔린"
              type="text"
              value={values.vehicleInfo}
              onChange={(event) => updateValue("vehicleInfo", event.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          제목
          <input
            className={inputClassName}
            placeholder="문의 제목을 입력해주세요"
            type="text"
            value={values.title}
            onChange={(event) => updateValue("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? <span className={errorClassName}>{errors.title}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-bold text-zinc-200">
          문의 내용
          <textarea
            className="min-h-56 rounded-md border border-white/10 bg-[#11100d] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d6a84f]"
            placeholder={`문의 내용을 자세히 적어주세요.\n\n선택한 문의: ${selectedTopic.label}\n필요 정보: ${selectedTopic.helper}`}
            value={values.content}
            onChange={(event) => updateValue("content", event.target.value)}
            aria-invalid={Boolean(errors.content)}
          />
          {errors.content ? <span className={errorClassName}>{errors.content}</span> : null}
        </label>

        <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
          <div>
            <p className="text-sm font-bold text-zinc-200">파일 첨부</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              상품 파손, 누유, 오배송 문의는 사진을 첨부하면 처리가 빨라집니다.
            </p>
            {attachments.length > 0 ? (
              <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-bold text-[#d6a84f]">{attachmentSummary}</p>
                <ul className="mt-2 grid gap-1 text-xs text-zinc-400">
                  {attachments.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <label className="flex h-12 cursor-pointer items-center justify-center rounded-md border border-white/10 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f]">
            파일 선택
            <input
              className="sr-only"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleAttachmentChange}
            />
          </label>
        </div>

        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <label className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
            <input
              className="mt-1 h-4 w-4 accent-[#d6a84f]"
              type="checkbox"
              checked={values.privacyAgreed}
              onChange={(event) => updateValue("privacyAgreed", event.target.checked)}
              aria-invalid={Boolean(errors.privacyAgreed)}
            />
            개인정보 수집 및 이용에 동의합니다. 문의 답변을 위해 이름, 이메일, 주문 정보를
            확인할 수 있습니다.
          </label>
          {errors.privacyAgreed ? (
            <p className={`mt-2 ${errorClassName}`}>{errors.privacyAgreed}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {submitMessage ? (
            <p className="text-sm font-bold text-zinc-300" role="status">
              {submitMessage}
            </p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={isSubmitting || !user}
            className="h-13 rounded-md bg-[#d6a84f] px-6 text-sm font-black text-black transition hover:bg-[#efc769] disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
          >
            {isSubmitting ? "접수 중..." : "문의 접수하기"}
          </button>
        </div>
      </form>
    </section>
  );
}

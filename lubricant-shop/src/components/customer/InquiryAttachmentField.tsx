import type { ChangeEvent } from "react";

type InquiryAttachmentFieldProps = {
  attachments: File[];
  attachmentSummary: string;
  onChangeAttachments: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InquiryAttachmentField({
  attachments,
  attachmentSummary,
  onChangeAttachments,
}: InquiryAttachmentFieldProps) {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
      <div>
        <p className="text-sm font-bold text-zinc-200">파일 첨부</p>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          상품 파손, 오일 누유, 배송 문의에 사진을 첨부하면 처리가 빨라집니다.
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
          onChange={onChangeAttachments}
        />
      </label>
    </div>
  );
}

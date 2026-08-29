type InquirySubmitBarProps = {
  submitMessage: string;
  isSubmitting: boolean;
};

export function InquirySubmitBar({ submitMessage, isSubmitting }: InquirySubmitBarProps) {
  return (
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
        disabled={isSubmitting}
        className="h-13 rounded-md bg-[#d6a84f] px-6 text-sm font-black text-black transition hover:bg-[#efc769] disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
      >
        {isSubmitting ? "접수 중..." : "문의 접수하기"}
      </button>
    </div>
  );
}

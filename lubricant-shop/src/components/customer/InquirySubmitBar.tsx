type InquirySubmitBarProps = {
  submitMessage: string;
  isSubmitting: boolean;
};

export function InquirySubmitBar({ submitMessage, isSubmitting }: InquirySubmitBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {submitMessage ? (
        <p className="text-sm font-bold text-[#34465c]" role="status">
          {submitMessage}
        </p>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-13 rounded-md bg-[#ff4b1f] px-6 text-sm font-black text-white transition hover:bg-[#e63e16] disabled:cursor-not-allowed disabled:bg-[#d8dde3] disabled:text-[#8a94a1]"
      >
        {isSubmitting ? "접수 중..." : "문의 접수하기"}
      </button>
    </div>
  );
}

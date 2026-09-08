"use client";

type CartToastProps = {
  notice: string | null;
};

const CartToast = ({ notice }: CartToastProps) => {
  if (!notice) {
    return null;
  }

  return (
    <div className="fixed right-5 top-[84px] z-[70] rounded-md border border-[#ffd3c5] bg-white px-4 py-3 text-sm font-semibold text-[#ff4b1f] shadow-2xl">
      {notice}
    </div>
  );
};

export default CartToast;

"use client";

type CartToastProps = {
  notice: string | null;
};

const CartToast = ({ notice }: CartToastProps) => {
  if (!notice) {
    return null;
  }

  return (
    <div className="fixed right-5 top-[76px] z-[70] rounded-md border border-[#d6a84f]/40 bg-[#171511] px-4 py-3 text-sm font-semibold text-[#d6a84f] shadow-2xl">
      {notice}
    </div>
  );
};

export default CartToast;

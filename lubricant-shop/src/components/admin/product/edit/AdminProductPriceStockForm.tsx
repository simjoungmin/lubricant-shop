import {
  type ProductEditForm,
  type ProductEditFormChangeHandler,
  productEditInputClassName,
  productEditLabelClassName,
} from "@/components/admin/product/edit/admin-product-edit.types";

type AdminProductPriceStockFormProps = {
  form: ProductEditForm;
  onChange: ProductEditFormChangeHandler;
};

export function AdminProductPriceStockForm({
  form,
  onChange,
}: AdminProductPriceStockFormProps) {
  return (
    <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
      <div>
        <p className="text-xs font-black text-[#d6a84f]">PRICE & STOCK</p>
        <h2 className="mt-2 text-xl font-black text-white">가격과 재고</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <NumberInput
          label="정상 판매가"
          value={form.price}
          onChange={(value) => onChange("price", value)}
        />
        <NumberInput
          label="할인 판매가"
          value={form.discountPrice}
          placeholder="없으면 비워두기"
          onChange={(value) => onChange("discountPrice", value)}
        />
        <NumberInput
          label="현재 재고"
          value={form.stock}
          onChange={(value) => onChange("stock", value)}
        />
        <NumberInput
          label="적립률"
          value={form.pointRewardRatePercent}
          inputMode="decimal"
          onChange={(value) => onChange("pointRewardRatePercent", value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.mainProduct}
            onChange={(event) => onChange("mainProduct", event.target.checked)}
          />
          메인 상품
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.recommended}
            onChange={(event) => onChange("recommended", event.target.checked)}
          />
          추천 상품
        </label>
      </div>
    </section>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode = "numeric",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className={productEditLabelClassName}>
      {label}
      <input
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={productEditInputClassName}
      />
    </label>
  );
}

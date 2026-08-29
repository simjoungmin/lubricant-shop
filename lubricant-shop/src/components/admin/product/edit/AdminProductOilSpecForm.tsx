import {
  type ProductEditForm,
  type ProductEditFormChangeHandler,
  productEditInputClassName,
  productEditLabelClassName,
} from "@/components/admin/product/edit/admin-product-edit.types";

type AdminProductOilSpecFormProps = {
  form: ProductEditForm;
  onChange: ProductEditFormChangeHandler;
};

export function AdminProductOilSpecForm({
  form,
  onChange,
}: AdminProductOilSpecFormProps) {
  return (
    <section className="grid gap-5 rounded-lg border border-white/10 bg-[#171611] p-5">
      <div>
        <p className="text-xs font-black text-[#d6a84f]">OIL SPEC</p>
        <h2 className="mt-2 text-xl font-black text-white">윤활유 정보</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SpecInput
          label="점도"
          value={form.viscosity}
          placeholder="5W-30"
          onChange={(value) => onChange("viscosity", value)}
        />
        <SpecInput
          label="규격"
          value={form.specification}
          placeholder="API SP / ACEA C3"
          onChange={(value) => onChange("specification", value)}
        />
        <SpecInput
          label="용량"
          value={form.volume}
          placeholder="1L"
          onChange={(value) => onChange("volume", value)}
        />
      </div>
    </section>
  );
}

function SpecInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={productEditLabelClassName}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={productEditInputClassName}
      />
    </label>
  );
}

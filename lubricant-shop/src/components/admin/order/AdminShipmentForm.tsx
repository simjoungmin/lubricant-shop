import type {
  AdminOrder,
  AdminOrderShipmentUpdateInput,
} from "@/components/admin/admin.api";
import { formatAdminOrderDateTime } from "@/components/admin/order/admin-order.labels";
import { AdminOrderInfoRow } from "@/components/admin/order/AdminOrderInfoCard";

type ShipmentDraftField = keyof AdminOrderShipmentUpdateInput;

type AdminShipmentFormProps = {
  order: AdminOrder;
  shipmentDraft: AdminOrderShipmentUpdateInput;
  isSavingShipment: boolean;
  onChangeShipment: (field: ShipmentDraftField, value: string) => void;
  onSaveShipment: () => void;
};

export function AdminShipmentForm({
  order,
  shipmentDraft,
  isSavingShipment,
  onChangeShipment,
  onSaveShipment,
}: AdminShipmentFormProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171611] p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black text-[#d6a84f]">SHIPMENT</p>
          <h2 className="mt-2 text-xl font-black text-white">배송 처리 정보</h2>
          <p className="mt-2 text-sm text-zinc-500">
            배송중 처리 전 택배사와 송장번호를 입력해야 합니다.
          </p>
        </div>
        <button
          type="button"
          disabled={isSavingShipment}
          onClick={onSaveShipment}
          className="h-10 rounded-md border border-white/10 px-4 text-sm font-black text-white transition hover:border-[#d6a84f] hover:text-[#d6a84f] disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
        >
          {isSavingShipment ? "저장 중" : "배송 정보 저장"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ShipmentInput
          label="택배사"
          value={shipmentDraft.courier}
          placeholder="예: CJ대한통운"
          onChange={(value) => onChangeShipment("courier", value)}
        />
        <ShipmentInput
          label="송장번호"
          value={shipmentDraft.trackingNumber}
          placeholder="숫자, 문자, 하이픈 그대로 입력"
          onChange={(value) => onChangeShipment("trackingNumber", value)}
        />
        <label className="grid gap-2 text-xs font-black text-zinc-500 md:col-span-2">
          출고 메모
          <input
            value={shipmentDraft.shipmentMemo}
            onChange={(event) => onChangeShipment("shipmentMemo", event.target.value)}
            placeholder="관리자 내부 메모"
            className="h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <AdminOrderInfoRow
          label="배송 시작일"
          value={order.shippedAt ? formatAdminOrderDateTime(order.shippedAt) : "아직 배송중 처리 전"}
        />
        <AdminOrderInfoRow
          label="배송 완료일"
          value={order.deliveredAt ? formatAdminOrderDateTime(order.deliveredAt) : "아직 배송완료 전"}
        />
      </div>
    </section>
  );
}

function ShipmentInput({
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
    <label className="grid gap-2 text-xs font-black text-zinc-500">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-md border border-white/10 bg-[#11100d] px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#d6a84f]"
      />
    </label>
  );
}

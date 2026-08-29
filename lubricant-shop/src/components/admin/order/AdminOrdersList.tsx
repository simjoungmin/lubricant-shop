import type { AdminOrder, OrderStatus } from "@/components/admin/admin.api";
import { AdminOrderCardActions } from "@/components/admin/order/AdminOrderCardActions";
import { AdminOrderCardSummary } from "@/components/admin/order/AdminOrderCardSummary";
import { AdminOrderItemsPreview } from "@/components/admin/order/AdminOrderItemsPreview";
import { AdminOrderQuickInfo } from "@/components/admin/order/AdminOrderQuickInfo";

type AdminOrdersListProps = {
  orders: AdminOrder[];
  drafts: Record<number, OrderStatus>;
  isCompletingPayment: boolean;
  isSavingStatus: boolean;
  onChangeDraft: (orderId: number, status: OrderStatus) => void;
  onCompletePayment: (orderId: number) => void;
  onSaveStatus: (orderId: number) => void;
};

export function AdminOrdersList({
  orders,
  drafts,
  isCompletingPayment,
  isSavingStatus,
  onChangeDraft,
  onCompletePayment,
  onSaveStatus,
}: AdminOrdersListProps) {
  return (
    <section className="grid gap-4">
      {orders.map((order) => {
        const draftStatus = drafts[order.orderId] ?? order.orderStatus;
        const isChanged = draftStatus !== order.orderStatus;

        return (
          <article key={order.orderId} className="rounded-lg border border-white/10 bg-[#171611] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <AdminOrderCardSummary order={order} />
              <AdminOrderCardActions
                order={order}
                draftStatus={draftStatus}
                isChanged={isChanged}
                isCompletingPayment={isCompletingPayment}
                isSavingStatus={isSavingStatus}
                onChangeDraft={onChangeDraft}
                onCompletePayment={onCompletePayment}
                onSaveStatus={onSaveStatus}
              />
            </div>

            <AdminOrderQuickInfo order={order} />
            <AdminOrderItemsPreview order={order} />
          </article>
        );
      })}
    </section>
  );
}

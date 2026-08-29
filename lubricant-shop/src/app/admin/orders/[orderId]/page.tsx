import { PageLayout } from "@/components/common/Layout";
import AdminOrderDetailContainer from "@/containers/admin/AdminOrderDetailContainer";
import { notFound } from "next/navigation";

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderId } = await params;
  const parsedOrderId = Number(orderId);

  if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
    notFound();
  }

  return (
    <PageLayout>
      <AdminOrderDetailContainer orderId={parsedOrderId} />
    </PageLayout>
  );
}

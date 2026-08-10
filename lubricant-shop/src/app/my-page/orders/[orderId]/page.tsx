import { PageLayout } from "@/components/common/Layout";
import MyOrderDetailContainer from "@/containers/MyOrderDetailContainer";
import { notFound } from "next/navigation";

type MyOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function MyOrderDetailPage({
  params,
}: MyOrderDetailPageProps) {
  const { orderId } = await params;
  const parsedOrderId = Number(orderId);

  if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
    notFound();
  }

  return (
    <PageLayout>
      <MyOrderDetailContainer orderId={parsedOrderId} />
    </PageLayout>
  );
}

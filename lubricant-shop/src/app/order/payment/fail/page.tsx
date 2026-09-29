import { PageLayout } from "@/components/common/Layout";
import PaymentFailContainer from "@/containers/PaymentFailContainer";

type PaymentFailPageProps = {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
};

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const { code, message, orderId } = await searchParams;

  return (
    <PageLayout>
      <PaymentFailContainer
        code={code}
        message={message}
        orderId={orderId}
      />
    </PageLayout>
  );
}

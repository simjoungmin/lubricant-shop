import { PageLayout } from "@/components/common/Layout";
import PaymentSuccessContainer from "@/containers/PaymentSuccessContainer";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { paymentKey, orderId, amount } = await searchParams;

  return (
    <PageLayout>
      <PaymentSuccessContainer
        paymentKey={paymentKey}
        orderId={orderId}
        amount={amount}
      />
    </PageLayout>
  );
}

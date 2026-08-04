import { PageLayout } from "@/components/common/Layout";
import FindEmailForm from "@/components/auth/recovery/FindEmailForm";
import OilHeader from "@/components/layout/OilHeader";

export default function FindEmailPage() {
  return (
    <PageLayout>
      <OilHeader />
      <FindEmailForm />
    </PageLayout>
  );
}

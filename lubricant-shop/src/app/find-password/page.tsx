import { PageLayout } from "@/components/common/Layout";
import FindPasswordForm from "@/components/auth/recovery/FindPasswordForm";
import OilHeader from "@/components/layout/OilHeader";

export default function FindPasswordPage() {
  return (
    <PageLayout>
      <OilHeader />
      <FindPasswordForm />
    </PageLayout>
  );
}

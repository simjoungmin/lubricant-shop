import { PageLayout } from "@/components/common/Layout";
import LoginForm from "@/components/auth/login/LoginForm";
import OilHeader from "@/components/layout/OilHeader";

export default function LoginPage() {
  return (
    <PageLayout>
      <OilHeader />
      <LoginForm />
    </PageLayout>
  );
}

import SignupPanel from "@/components/auth/signup/SignupPanel";
import { PageLayout } from "@/components/common/Layout";
import OilHeader from "@/components/layout/OilHeader";

export default function SignupPage() {
  return (
    <PageLayout>
      <OilHeader />
      <main className="bg-white text-[#111]">
        <section className="mx-auto min-h-[132px] w-full max-w-[1280px] px-6 pt-[78px]">
          <h1 className="text-center text-[25px] font-black text-black">
            회원 가입
          </h1>
        </section>
        <SignupPanel />
      </main>
    </PageLayout>
  );
}

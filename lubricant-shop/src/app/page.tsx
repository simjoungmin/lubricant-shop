import { PageLayout } from "@/components/common/Layout";
import MainpageContainer from "@/containers/MainpageContainer";

type HomePageProps = {
  searchParams: Promise<{
    notice?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { notice } = await searchParams;

  return (
    <PageLayout>
      <MainpageContainer />
    </PageLayout>
  );
}

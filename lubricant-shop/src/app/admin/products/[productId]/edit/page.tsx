import AdminProductEditContainer from "@/containers/admin/AdminProductEditContainer";
import { notFound } from "next/navigation";

type AdminProductEditPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { productId } = await params;
  const parsedProductId = Number(productId);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    notFound();
  }

  return <AdminProductEditContainer productId={parsedProductId} />;
}

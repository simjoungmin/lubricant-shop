import type { ProductStatus } from "@/components/admin/admin.api";

export const adminProductStatusLabel: Record<ProductStatus, string> = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  STOPPED: "판매중지",
  HIDDEN: "임시 저장",
};

export const adminProductCategoryLabel: Record<string, string> = {
  engine: "엔진오일",
  mission: "미션오일",
  brake: "브레이크액",
  filter: "필터",
  gear: "기어 오일",
  chemical: "케미컬",
};

export const adminProductStatusOptions = Object.keys(adminProductStatusLabel) as ProductStatus[];

export const formatAdminProductDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

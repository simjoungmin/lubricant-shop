import { brakeSubCategories } from "./sub-categories/brake";
import { chemicalSubCategories } from "./sub-categories/chemical";
import { engineSubCategories } from "./sub-categories/engine";
import { filterSubCategories } from "./sub-categories/filter";
import { gearSubCategories } from "./sub-categories/gear";
import { missionSubCategories } from "./sub-categories/mission";
import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "engine",
    title: "엔진오일",
    description: "차량과 주행 환경에 맞는 점도별 엔진오일입니다.",
    subCategories: engineSubCategories,
  },
  {
    slug: "mission",
    title: "미션오일",
    description: "자동변속기와 수동변속기에 맞는 변속기 오일입니다.",
    subCategories: missionSubCategories,
  },
  {
    slug: "brake",
    title: "브레이크액",
    description: "안정적인 제동을 위한 규격별 브레이크액입니다.",
    subCategories: brakeSubCategories,
  },
  {
    slug: "filter",
    title: "필터",
    description: "엔진 성능과 실내 공기를 관리하는 필터입니다.",
    subCategories: filterSubCategories,
  },
  {
    slug: "gear",
    title: "기어 오일",
    description: "기어박스와 디퍼렌셜 보호를 위한 윤활유입니다.",
    subCategories: gearSubCategories,
  },
  {
    slug: "chemical",
    title: "케미컬",
    description: "차량 관리와 컨디션 회복을 위한 케미컬 상품입니다.",
    subCategories: chemicalSubCategories,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  categories.some((category) => category.slug === slug);

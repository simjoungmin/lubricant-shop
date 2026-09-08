import { brakePowerSubCategories } from "./sub-categories/brake-power";
import { chemicalSubCategories } from "./sub-categories/chemical";
import { coolantSubCategories } from "./sub-categories/coolant";
import { engineSubCategories } from "./sub-categories/engine";
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
    title: "자동 미션 오일",
    description: "ATF, CVT, DCT 계열 자동변속기 오일입니다.",
    subCategories: missionSubCategories,
  },
  {
    slug: "gear",
    title: "기어 오일",
    description: "기어박스, 트랜스퍼케이스, 할덱스 계통 보호를 위한 오일입니다.",
    subCategories: gearSubCategories,
  },
  {
    slug: "brake-power",
    title: "브레이크액·파워오일",
    description: "제동 및 조향 계통 관리를 위한 브레이크액과 파워오일입니다.",
    subCategories: brakePowerSubCategories,
  },
  {
    slug: "coolant",
    title: "부동액",
    description: "색상과 규격에 맞춰 선택하는 냉각수 및 부동액입니다.",
    subCategories: coolantSubCategories,
  },
  {
    slug: "chemical",
    title: "케미컬·첨가제",
    description: "엔진, 미션, 냉각, 세정 관리를 위한 케미컬 상품입니다.",
    subCategories: chemicalSubCategories,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  categories.some((category) => category.slug === slug);

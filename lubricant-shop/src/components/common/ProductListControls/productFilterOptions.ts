export type ProductControlOption = {
  label: string;
  value: string;
};

export const defaultSortOptions: ProductControlOption[] = [
  { label: "인기순", value: "popular" },
  { label: "낮은 가격순", value: "price-low" },
  { label: "높은 가격순", value: "price-high" },
];

export const defaultPageSizeOptions: ProductControlOption[] = [
  { label: "20개씩 보기", value: "20" },
  { label: "40개씩 보기", value: "40" },
];

export const fuelTypeOptions: ProductControlOption[] = [
  { label: "연료/차종 전체", value: "" },
  { label: "가솔린", value: "gasoline" },
  { label: "디젤", value: "diesel" },
  { label: "하이브리드", value: "hybrid" },
  { label: "유럽차", value: "europe" },
];

export const viscosityOptions: ProductControlOption[] = [
  { label: "점도 전체", value: "" },
  { label: "0W-20", value: "0w-20" },
  { label: "5W-30", value: "5w-30" },
  { label: "5W-40", value: "5w-40" },
  { label: "10W-40", value: "10w-40" },
  { label: "75W-90", value: "75w-90" },
  { label: "80W-90", value: "80w-90" },
  { label: "85W-140", value: "85w-140" },
];

export const standardOptions: ProductControlOption[] = [
  { label: "규격 전체", value: "" },
  { label: "API", value: "api" },
  { label: "ACEA", value: "acea" },
  { label: "ATF", value: "atf" },
  { label: "CVT", value: "cvt" },
  { label: "DCT", value: "dct" },
  { label: "DOT 4", value: "dot-4" },
  { label: "DOT 5.1", value: "dot-5-1" },
  { label: "GL-5", value: "gl-5" },
  { label: "오일필터", value: "oil-filter" },
  { label: "에어필터", value: "air-filter" },
  { label: "캐빈필터", value: "cabin-filter" },
  { label: "첨가제", value: "additive" },
  { label: "냉각수", value: "coolant" },
];

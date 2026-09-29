import CategoryFilterButtons from "./CategoryFilterButtons";

type BrandFilterButtonsProps = {
  brands: string[];
  selectedBrand: string;
};

const BrandFilterButtons = ({
  brands,
  selectedBrand,
}: BrandFilterButtonsProps) => {
  return (
    <CategoryFilterButtons
      items={brands}
      selectedValue={selectedBrand}
      queryKey="brand"
    />
  );
};

export default BrandFilterButtons;

import CategoryFilterButtons from "./CategoryFilterButtons";

type ViscosityFilterButtonsProps = {
  viscosities: string[];
  selectedViscosity: string;
};

const ViscosityFilterButtons = ({
  viscosities,
  selectedViscosity,
}: ViscosityFilterButtonsProps) => {
  return (
    <CategoryFilterButtons
      items={viscosities}
      selectedValue={selectedViscosity}
      queryKey="viscosity"
    />
  );
};

export default ViscosityFilterButtons;

import { useState } from "react";
import useIsMobile from "../../../hooks/useIsMobile";
import BottomSheet from "../../BottomSheet/BottomSheet";
import Modal from "../../Modal/Modal";
import FilterContent from "./FilterContent";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    place: FilterOption[];
    type: FilterOption[];
    origin: FilterOption[];
  }) => void;
  filterOptions: {
    place: FilterOption[];
    type: FilterOption[];
    origin: FilterOption[];
  };
  isLoading?: boolean;
}

export default function FilterDialog({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  isLoading = false,
}: FilterDialogProps) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState({
    place: [],
    type: [],
    origin: [],
  } as Record<string, FilterOption[]>);

  const hasSelections =
    selected.place.length > 0 ||
    selected.type.length > 0 ||
    selected.origin.length > 0;

  const handleClear = () => {
    setSelected({ place: [], type: [], origin: [] });
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const buttonGroup = (
    <div className="w-full px-4 pb-4">
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleClear}
          disabled={isLoading || !hasSelections}
          className={`w-1/2 py-2 rounded-full font-medium transition-colors shadow-md ${
            hasSelections && !isLoading
              ? "bg-white text-primary hover:bg-primary-light"
              : "bg-white text-gray cursor-not-allowed"
          }`}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          disabled={isLoading || !hasSelections}
          className={`w-1/2 py-2 rounded-full font-medium transition-colors shadow-md ${
            hasSelections && !isLoading
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted text-gray cursor-not-allowed"
          }`}
        >
          {isLoading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );

  const content = (
    <FilterContent
      onClose={onClose}
      onApply={onApply}
      filterOptions={filterOptions}
      isLoading={isLoading}
      selected={selected}
      setSelected={setSelected}
    />
  );

  return isMobile ? (
    <BottomSheet
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      withButton
      buttonContent={buttonGroup}
    >
      {content}
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} scrollable width="max-w-md">
      <div className="p-4">
        {content}
        {buttonGroup}
      </div>
    </Modal>
  );
}

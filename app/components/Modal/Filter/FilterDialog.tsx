import { useTheme } from "@emotion/react";
import { useState } from "react";
import useIsMobile from "@Hooks/useIsMobile";
import BottomSheet from "@Components/BottomSheet/BottomSheet";
import Modal from "@Components/Modal/Modal";
import FilterContent from "./FilterContent";
import getStyle from "./FilterDialog.css";
import type {
  FilterDialogProps,
  FilterOption,
} from "@Types/components/FilterDialog.type";

const FilterDialog = ({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  isLoading = false,
}: FilterDialogProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState({
    city: [],
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

  const styles = getStyle(theme, { hasSelections, isLoading });

  const buttonGroup = (
    <div css={styles.buttonContainer}>
      <div css={styles.buttonRow}>
        <button
          onClick={handleClear}
          disabled={isLoading || !hasSelections}
          css={styles.clearButton}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          disabled={isLoading || !hasSelections}
          css={styles.applyButton}
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
      buttonContent={
        <span onClick={handleApply}>{isLoading ? "Applying..." : "Apply"}</span>
      }
    >
      {content}
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} scrollable width="28rem">
      <div css={styles.modalBody}>
        {content}
        {buttonGroup}
      </div>
    </Modal>
  );
};

export default FilterDialog;

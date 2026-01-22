import { useTheme } from "@emotion/react";
import { RiFilter3Fill, RiMapPinLine } from "react-icons/ri";
import getStyle from "@Components/FiltersHeader/FiltersHeader.css";
import type { FiltersHeaderProps } from "@Types/components/FiltersHeader.type";

const FiltersHeader = ({
  hasActiveFilters,
  restaurantCount,
  showLocationButton,
  onReset,
  onOpenFilters,
  onRequestLocation,
}: FiltersHeaderProps) => {
  const theme = useTheme();
  const styles = getStyle(theme, hasActiveFilters);

  return (
    <div css={styles.wrapper}>
      <div css={styles.left}>
        <h2 css={styles.title}>Today&apos;s Pick</h2>
        {hasActiveFilters && (
          <span css={styles.subtitle}>({restaurantCount} filtered)</span>
        )}
        {showLocationButton && (
          <button onClick={onRequestLocation} css={styles.iconButton}>
            <RiMapPinLine size={20} />
          </button>
        )}
      </div>

      <div css={styles.right}>
        {hasActiveFilters && (
          <button onClick={onReset} css={styles.reset}>
            Reset
          </button>
        )}
        <button onClick={onOpenFilters} css={styles.filterButton}>
          <RiFilter3Fill size={24} />
        </button>
      </div>
    </div>
  );
};

export default FiltersHeader;

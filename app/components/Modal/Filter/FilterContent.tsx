import { useTheme } from "@emotion/react";
import type { FilterContentProps } from "@Types/components/FilterContent.type";
import getStyle from "./FilterContent.css";
import type { FilterOption } from "~/types/components/FilterDialog.type";

const FilterContent = ({
  filterOptions,
  isLoading = false,
  selected,
  setSelected,
}: FilterContentProps) => {
  const theme = useTheme();
  const styles = getStyle(theme, isLoading);

  const toggle = (key: "place" | "type" | "origin", option: FilterOption) => {
    setSelected((prev) => {
      const exists = prev[key].some((item) => item.value === option.value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item.value !== option.value)
          : [...prev[key], option],
      };
    });
  };

  const renderOptions = (
    key: "place" | "type" | "origin",
    options: FilterOption[],
  ) => (
    <div css={styles.section}>
      <h3 css={styles.sectionTitle}>
        {key[0].toUpperCase() + key.slice(1)}
        {selected[key].length > 0 ? ` (${selected[key].length})` : ""}
      </h3>
      <div css={styles.pills}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(key, opt)}
            disabled={isLoading}
            css={styles.pill(selected[key].some((i) => i.value === opt.value))}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div css={styles.container}>
      <h2 css={styles.heading}>Filter</h2>
      {renderOptions("place", filterOptions.place)}
      {renderOptions("type", filterOptions.type)}
      {renderOptions("origin", filterOptions.origin)}
    </div>
  );
};

export default FilterContent;

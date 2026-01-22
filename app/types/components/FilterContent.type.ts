import type { FilterOption } from "@Types/components/FilterDialog.type";

export interface FilterContentProps {
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
  onClose: () => void;
  selected: Record<string, FilterOption[]>;
  setSelected: (selected: Record<string, FilterOption[]>) => void;
  onClear?: () => void;
}

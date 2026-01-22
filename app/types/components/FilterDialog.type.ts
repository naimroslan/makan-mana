export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDialogProps {
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

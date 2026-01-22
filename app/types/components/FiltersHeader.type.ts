export interface FiltersHeaderProps {
  hasActiveFilters: boolean;
  restaurantCount: number;
  showLocationButton: boolean;
  onReset: () => void;
  onOpenFilters: () => void;
  onRequestLocation: () => void;
}

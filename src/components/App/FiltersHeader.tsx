import { RiFilter3Fill, RiMapPinLine } from "react-icons/ri";

interface FiltersHeaderProps {
  hasActiveFilters: boolean;
  restaurantCount: number;
  showLocationButton: boolean;
  onReset: () => void;
  onOpenFilters: () => void;
  onRequestLocation: () => void;
}

export default function FiltersHeader({
  hasActiveFilters,
  restaurantCount,
  showLocationButton,
  onReset,
  onOpenFilters,
  onRequestLocation,
}: FiltersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <h2 className="text-primary text-lg font-semibold">Today's Pick</h2>
        {hasActiveFilters && (
          <span className="text-sm font-normal text-gray">
            ({restaurantCount} filtered)
          </span>
        )}
        {showLocationButton && (
          <button
            onClick={onRequestLocation}
            className="p-1 transition-colors text-gray hover:text-primary"
          >
            <RiMapPinLine className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary underline hover:text-primary/80"
          >
            Reset
          </button>
        )}
        <button
          onClick={onOpenFilters}
          className={`p-1 transition-colors ${
            hasActiveFilters ? "text-primary" : "text-gray"
          }`}
        >
          <RiFilter3Fill className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

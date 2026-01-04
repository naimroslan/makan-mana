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
        <h2 className="text-text text-xl font-bold">Today&apos;s Pick</h2>
        {hasActiveFilters && (
          <span className="text-sm font-normal text-gray-500">
            ({restaurantCount} filtered)
          </span>
        )}
        {showLocationButton && (
          <button
            onClick={onRequestLocation}
            className="p-1 transition-colors text-gray-500 hover:text-text"
          >
            <RiMapPinLine className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-text underline hover:text-text/80"
          >
            Reset
          </button>
        )}
        <button
          onClick={onOpenFilters}
          className={`p-1 transition-colors ${
            hasActiveFilters ? "text-text" : "text-gray-500"
          }`}
        >
          <RiFilter3Fill className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

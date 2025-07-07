import { useState, useRef, useEffect } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterModalProps {
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

function FilterModal({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  isLoading = false,
}: FilterModalProps) {
  const [selected, setSelected] = useState<{
    place: FilterOption[];
    type: FilterOption[];
    origin: FilterOption[];
  }>({ place: [], type: [], origin: [] });

  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleApply = () => {
    onApply(selected);
    setSelected({ place: [], type: [], origin: [] });
    onClose();
  };

  const clearAll = () => {
    setSelected({ place: [], type: [], origin: [] });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasSelections =
    selected.place.length > 0 ||
    selected.type.length > 0 ||
    selected.origin.length > 0;

  const isSelected = (key: "place" | "type" | "origin", value: string) =>
    selected[key].some((item) => item.value === value);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray hover:text-primary text-xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Place */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">
            Place {selected.place.length > 0 && `(${selected.place.length})`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.place.map((p) => (
              <button
                key={p.value}
                onClick={() => toggle("place", p)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  isSelected("place", p.value)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">
            Type {selected.type.length > 0 && `(${selected.type.length})`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.type.map((t) => (
              <button
                key={t.value}
                onClick={() => toggle("type", t)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  isSelected("type", t.value)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">
            Origin {selected.origin.length > 0 && `(${selected.origin.length})`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.origin.map((o) => (
              <button
                key={o.value}
                onClick={() => toggle("origin", o)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  isSelected("origin", o.value)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={clearAll}
            disabled={isLoading || !hasSelections}
            className={`w-1/2 py-2 rounded-full font-medium transition-colors ${
              hasSelections && !isLoading
                ? "text-primary hover:bg-primary-light"
                : "text-gray cursor-not-allowed"
            }`}
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={isLoading || !hasSelections}
            className={`w-1/2 py-2 rounded-full font-medium transition-colors ${
              hasSelections && !isLoading
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-gray cursor-not-allowed"
            }`}
          >
            {isLoading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;

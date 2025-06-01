import { useState, useRef, useEffect } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    place: string[];
    type: string[];
    origin: string[];
  }) => void;
  filterOptions: {
    place: string[];
    type: string[];
    origin: string[];
  };
  isLoading?: boolean; // Add loading state prop
}

function formatLabel(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function FilterModal({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  isLoading = false,
}: FilterModalProps) {
  const [selected, setSelected] = useState({
    place: [] as string[],
    type: [] as string[],
    origin: [] as string[],
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const toggle = (key: "place" | "type" | "origin", value: string) => {
    setSelected((prev) => {
      const current = new Set(prev[key]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [key]: Array.from(current) };
    });
  };

  const handleApply = () => {
    onApply(selected);
  };

  const clearAll = () => {
    setSelected({ place: [], type: [], origin: [] });
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected({ place: [], type: [], origin: [] });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasSelections =
    selected.place.length > 0 ||
    selected.type.length > 0 ||
    selected.origin.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Filter Restaurants
          </h2>
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
                key={p}
                onClick={() => toggle("place", p)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected.place.includes(p)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formatLabel(p)}
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
                key={t}
                onClick={() => toggle("type", t)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected.type.includes(t)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formatLabel(t)}
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
                key={o}
                onClick={() => toggle("origin", o)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected.origin.includes(o)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light hover:bg-primary-light"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formatLabel(o)}
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

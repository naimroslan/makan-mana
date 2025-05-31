import { useState, useEffect } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedFilters: {
    place: string[];
    people: string[];
    type: string[];
  }) => void;
  filters?: {
    place?: string[];
    people?: string[];
    type?: string[];
  };
}

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  filters = {},
}: FilterModalProps) {
  const [selected, setSelected] = useState<{
    place: string[];
    people: string[];
    type: string[];
  }>({
    place: [],
    people: [],
    type: [],
  });

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      setSelected({ place: [], people: [], type: [] });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleItem = (category: keyof typeof selected, item: string) => {
    setSelected((prev) => {
      const list = prev[category];
      const isSelected = list.includes(item);
      return {
        ...prev,
        [category]: isSelected
          ? list.filter((i) => i !== item)
          : [...list, item],
      };
    });
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const renderChips = (
    items: string[] = [],
    category: keyof typeof selected,
  ) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isChecked = selected[category].includes(item);
        return (
          <button
            key={item}
            onClick={() => toggleItem(category, item)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                isChecked
                  ? "bg-primary text-white border-primary"
                  : "bg-light text-gray border-border hover:bg-primary-light"
              }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Category: Place */}
        {filters.place && filters.place.length > 0 && (
          <div className="mb-5">
            <h3 className="text-gray font-semibold mb-2">Place</h3>
            {renderChips(filters.place, "place")}
          </div>
        )}

        {/* Category: People */}
        {filters.people && filters.people.length > 0 && (
          <div className="mb-5">
            <h3 className="text-gray font-semibold mb-2">People</h3>
            {renderChips(filters.people, "people")}
          </div>
        )}

        {/* Category: Type */}
        {filters.type && filters.type.length > 0 && (
          <div className="mb-5">
            <h3 className="text-gray font-semibold mb-2">Type</h3>
            {renderChips(filters.type, "type")}
          </div>
        )}

        <button
          onClick={handleApply}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold mt-4 disabled:bg-muted"
          disabled={
            selected.place.length === 0 &&
            selected.people.length === 0 &&
            selected.type.length === 0
          }
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}

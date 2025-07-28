interface FilterOption {
  label: string;
  value: string;
}

interface FilterContentProps {
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
}

export default function FilterContent({
  onApply,
  filterOptions,
  isLoading = false,
  onClose,
  selected,
  setSelected,
}: FilterContentProps) {
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
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray mb-2">
        {key[0].toUpperCase() + key.slice(1)}
        {selected[key].length > 0 ? ` (${selected[key].length})` : ""}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(key, opt)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              selected[key].some((i) => i.value === opt.value)
                ? "bg-primary text-white border-primary"
                : "bg-light text-primary border-primary-light hover:bg-primary-light"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 overflow-y-auto max-h-[60vh]">
      <h2 className="text-lg font-semibold text-primary mb-4">Filter</h2>
      {renderOptions("place", filterOptions.place)}
      {renderOptions("type", filterOptions.type)}
      {renderOptions("origin", filterOptions.origin)}
    </div>
  );
}

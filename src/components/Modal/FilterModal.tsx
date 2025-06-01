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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-auto"
      >
        {/* Place */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">Place</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.place.map((p) => (
              <button
                key={p}
                onClick={() => toggle("place", p)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selected.place.includes(p)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light"
                }`}
              >
                {formatLabel(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">Type</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.type.map((t) => (
              <button
                key={t}
                onClick={() => toggle("type", t)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selected.type.includes(t)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light"
                }`}
              >
                {formatLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray mb-2">Origin</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.origin.map((o) => (
              <button
                key={o}
                onClick={() => toggle("origin", o)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selected.origin.includes(o)
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-primary border-primary-light"
                }`}
              >
                {formatLabel(o)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-full text-primary font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="w-1/2 py-2 rounded-full bg-primary text-white font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;

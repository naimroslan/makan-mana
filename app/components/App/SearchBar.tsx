import { FaWandMagicSparkles } from "react-icons/fa6";

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div>
      <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-border">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
          className="flex-1 bg-transparent focus:outline-none text-text px-3 font-semibold text-[17px] placeholder:text-gray-400"
          placeholder="What are you in the mood to eat?"
        />
        <button
          onClick={onSearch}
          disabled={!value.trim()}
          className="px-4 py-3 text-secondary text-xl font-bold disabled:opacity-50"
        >
          <FaWandMagicSparkles />
        </button>
      </div>
    </div>
  );
}

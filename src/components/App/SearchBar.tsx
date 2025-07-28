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
      <h2 className="text-primary text-xl font-semibold mb-2">
        Ask Me Anything
      </h2>
      <div className="flex items-center bg-primary-light rounded-full p-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
          className="flex-1 bg-transparent focus:outline-none text-primary px-2 font-funnel font-semibold"
          placeholder="What you feel like eating?"
        />
        <button
          onClick={onSearch}
          disabled={!value.trim()}
          className="px-5 py-3 text-secondary text-xl font-bold disabled:opacity-50"
        >
          <FaWandMagicSparkles />
        </button>
      </div>
    </div>
  );
}

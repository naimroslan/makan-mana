import { FiBell, FiMail } from "react-icons/fi";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      <div>
        <h1 className="text-2xl font-semibold text-primary leading-snug">
          Find your
          <br />
          favorite place
        </h1>
      </div>

      <div className="flex space-x-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-gray-200 transition">
          <FiBell size={18} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-gray-200 transition">
          <FiMail size={18} />
        </button>
      </div>
    </header>
  );
}

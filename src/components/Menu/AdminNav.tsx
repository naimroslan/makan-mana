import { useState } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine } from "react-icons/ri";

const MENU_ITEMS = ["Dashboard", "Create", "Update", "Delete"];

export default function AdminNav({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (item: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center mt-10 p-4 bg-white/60 backdrop-blur-xl">
      <button
        onClick={() => setIsOpen(true)}
        className="text-lg font-semibold text-primary px-4 py-2 bg-white rounded-xl hover:bg-secondary hover:text-white transition"
      >
        {current}
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setIsOpen(false);
                    onSelect(item);
                  }}
                  className={`text-xl font-semibold transition ${
                    current === item ? "text-black" : "text-gray-400"
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-400 mt-6"
              >
                <RiCloseLine />
              </button>
            </div>
          </div>,
          document.body, // renders outside app layout
        )}
    </div>
  );
}

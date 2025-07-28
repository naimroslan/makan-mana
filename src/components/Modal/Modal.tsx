import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  scrollable?: boolean;
  width?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  scrollable = false,
  width = "max-w-lg",
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`relative w-full ${width} bg-white rounded-2xl p-6 shadow-xl border border-border ${className} ${scrollable ? "max-h-[80vh] overflow-y-auto" : ""}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray hover:text-primary text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

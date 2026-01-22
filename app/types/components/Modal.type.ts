import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  scrollable?: boolean;
  /**
   * Max-width for the dialog; accepts CSS values.
   * Tailwind-style tokens (`max-w-sm` etc) are mapped for backward compatibility.
   */
  width?: string | number;
  className?: string;
}

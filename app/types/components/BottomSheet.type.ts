import type { ReactNode } from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  withButton?: boolean;
  floatingButton?: boolean;
  buttonContent?: ReactNode;
  size?: "sm" | "md" | "lg";
}

import { css, useTheme } from "@emotion/react";
import type { ModalProps } from "@Types/components/Modal.type";
import getStyle from "./Modal.css";

const widthMap: Record<string, string> = {
  "max-w-sm": "24rem",
  "max-w-md": "28rem",
  "max-w-lg": "32rem",
};

const Modal = ({
  isOpen,
  onClose,
  children,
  scrollable = false,
  width = "32rem",
  className,
}: ModalProps) => {
  const theme = useTheme();

  if (!isOpen) return null;

  const resolvedWidth =
    typeof width === "number"
      ? `${width}px`
      : (widthMap[width] ?? width ?? "32rem");

  const styles = getStyle(theme, resolvedWidth, scrollable);

  return (
    <div css={styles.overlay}>
      <div css={styles.dialog} className={className}>
        <button onClick={onClose} css={styles.close} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

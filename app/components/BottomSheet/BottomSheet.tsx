import { css, useTheme } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createPortal } from "react-dom";
import type { BottomSheetProps } from "@Types/components/BottomSheet.type";
import getStyle from "@Components/BottomSheet/BottomSheet.css";

const SIZE_HEIGHT_MAP: Record<NonNullable<BottomSheetProps["size"]>, string> = {
  sm: "15%",
  md: "30%",
  lg: "50%",
};

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  withButton = false,
  floatingButton = true,
  buttonContent,
  size = "md",
}: BottomSheetProps) => {
  const theme = useTheme();

  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [canClose, setCanClose] = useState(false);
  const height = SIZE_HEIGHT_MAP[size];

  const styles = getStyle(theme, height, withButton, floatingButton);

  useEffect(() => {
    if (isOpen) {
      gsap.killTweensOf([sheetRef.current, backdropRef.current]);
      setCanClose(false);

      gsap.fromTo(
        sheetRef.current,
        { y: "100%" },
        {
          y: `calc(100% - ${height})`,
          duration: 0.3,
          ease: "power3.out",
          onComplete: () => setCanClose(true),
        },
      );
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
    } else if (sheetRef.current && backdropRef.current) {
      setCanClose(false);
      gsap.to(sheetRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power3.inOut",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isOpen, height]);

  if (!isOpen) return null;

  return createPortal(
    <div css={styles.overlay}>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        css={styles.backdrop}
        onClick={canClose ? onClose : undefined}
      />

      {/* Sheet */}
      <div ref={sheetRef} css={styles.sheet}>
        <div css={styles.handle} />

        <div css={styles.content}>{children}</div>

        {withButton && buttonContent && (
          <div css={styles.buttonWrapper}>
            <button
              css={styles.button}
              onClick={
                typeof buttonContent === "object" && "props" in buttonContent
                  ? buttonContent.props?.onClick
                  : undefined
              }
            >
              {buttonContent}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;

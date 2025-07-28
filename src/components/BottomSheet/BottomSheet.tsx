import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  withButton?: boolean;
  floatingButton?: boolean;
  buttonContent?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_HEIGHT_MAP: Record<NonNullable<BottomSheetProps["size"]>, string> = {
  sm: "15%",
  md: "30%",
  lg: "50%",
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  withButton = false,
  floatingButton = true,
  buttonContent,
  size = "md",
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [canClose, setCanClose] = useState(false);
  const height = SIZE_HEIGHT_MAP[size];

  useEffect(() => {
    if (isOpen) {
      // Kill any existing animations first
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 w-full rounded-t-3xl bg-white px-4 pt-4 pb-6 shadow-xl flex flex-col"
        style={{ height }}
      >
        {/* Handle */}
        <div className="h-1.5 w-10 bg-gray-300 rounded-full mx-auto mb-4" />
        {/* Scrollable content */}
        <div
          className={`overflow-y-auto grow ${
            withButton && floatingButton ? "pb-20" : "pb-6"
          }`}
        >
          {children}
        </div>
        {/* Button */}
        {withButton && (
          <div
            className={`w-full px-4 ${
              floatingButton ? "absolute bottom-6 left-0" : "mt-4"
            }`}
          >
            {buttonContent}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

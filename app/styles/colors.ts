export const colors = {
  red: {
    100: "#fee2e2",
    200: "#fecdd3",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // used across UI as primary
    600: "#dc2626",
    700: "#b91c1c",
  },
  cyan: {
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4", // seen in README badge (Tailwind cyan)
    600: "#0891b2",
  },
  gray: {
    50: "#f8fafc", // light background already used
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#d1d5db", // used in inline styles
    500: "#6b7280",
    600: "#4b5563", // used in inline styles
    700: "#334155",
    900: "#0f172a", // text color used in Home styles
  },
  white: {
    0: "#ffffff",
  },
  black: {
    0: "#000000",
    900: "#0b1120",
  },
};

export type Colors = typeof colors;

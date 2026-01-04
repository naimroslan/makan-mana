export const shadow = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
  md: "0 4px 12px rgba(15, 23, 42, 0.08)",
  lg: "0 10px 25px rgba(15, 23, 42, 0.12)",
} as const;

export type Shadow = typeof shadow;

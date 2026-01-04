import type { Theme as EmotionTheme } from "@emotion/react";
import { colors } from "./colors";
import { radius, spacing } from "./spacing";
import { shadow } from "./shadow";
import {
  fontWeight,
  Typography,
  TypographyMobile,
  TypographySizes,
  TypographySizesMobile,
} from "./fonts.css";

/**
 * Breakpoint definitions
 * Ranges:
 * - mobile: 0 - 767px
 * - tablet: 768 - 1023px
 * - laptop: 1024 - 1365px
 * - desktop: 1366px+
 */
export const breakPoints = {
  mobile: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1224px",
  laptopLarge: "1366px",
  desktop: "1440px",
  ultraWide: "2560px",
} as const;

export const heightBreakpoints = {
  short: "700px",
  medium: "750px",
  tall: "900px",
  veryTall: "1200px",
} as const;

export const theme = {
  breakPoints,
  heightBreakpoints,
  colors: {
    ...colors,
    primary: colors.red[500],
    primaryLight: colors.red[300],
    primaryDark: colors.red[700],
    secondary: colors.cyan[500],
    secondaryDark: colors.cyan[600],
    light: colors.gray[50],
    muted: colors.gray[300],
    border: colors.gray[200],
    text: colors.gray[900],
  },
  spacing,
  radius,
  font: {
    fontWeight,
    Typography,
    TypographyMobile,
    size: TypographySizes,
    sizeMobile: TypographySizesMobile,
  },
  shadow,
  zIndex: {
    page: 1,
    overlay: 10,
    modal: 100,
    toast: 110,
  },
} as const;

export type AppTheme = typeof theme;
export type Theme = AppTheme;

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends AppTheme, EmotionTheme {}
}

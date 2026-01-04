import { css } from "@emotion/react";
import funnelDisplay from "../assets/fonts/FunnelDisplay.ttf";

export const fontFaces = css`
  @font-face {
    font-family: "Funnel Display";
    src: url(${funnelDisplay}) format("truetype");
    font-weight: 400 800;
    font-display: swap;
  }
`;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const Typography = {
  h1: css`
    font-size: 2.5rem;
    line-height: 1.15;
    font-weight: ${fontWeight.bold};
  `,
  h2: css`
    font-size: 2rem;
    line-height: 1.2;
    font-weight: ${fontWeight.semibold};
  `,
  h3: css`
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: ${fontWeight.semibold};
  `,
  h4: css`
    font-size: 1.25rem;
    line-height: 1.35;
    font-weight: ${fontWeight.medium};
  `,
  h5: css`
    font-size: 1.125rem;
    line-height: 1.4;
    font-weight: ${fontWeight.medium};
  `,
  h6: css`
    font-size: 1rem;
    line-height: 1.4;
    font-weight: ${fontWeight.medium};
  `,
} as const;

export const TypographyMobile = {
  h1: css`
    font-size: 2rem;
    line-height: 1.2;
    font-weight: ${fontWeight.bold};
  `,
  h2: css`
    font-size: 1.75rem;
    line-height: 1.25;
    font-weight: ${fontWeight.semibold};
  `,
  h3: css`
    font-size: 1.375rem;
    line-height: 1.3;
    font-weight: ${fontWeight.semibold};
  `,
  h4: css`
    font-size: 1.2rem;
    line-height: 1.35;
    font-weight: ${fontWeight.medium};
  `,
  h5: css`
    font-size: 1.05rem;
    line-height: 1.4;
    font-weight: ${fontWeight.medium};
  `,
  h6: css`
    font-size: 0.95rem;
    line-height: 1.4;
    font-weight: ${fontWeight.medium};
  `,
} as const;

export const TypographySizes = {
  h1: "2.5rem",
  h2: "2rem",
  h3: "1.5rem",
  h4: "1.25rem",
  h5: "1.125rem",
  h6: "1rem",
} as const;

export const TypographySizesMobile = {
  h1: "2rem",
  h2: "1.75rem",
  h3: "1.375rem",
  h4: "1.2rem",
  h5: "1.05rem",
  h6: "0.95rem",
} as const;

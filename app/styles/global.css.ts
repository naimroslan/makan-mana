import { css } from "@emotion/react";
import type { AppTheme } from "./theme.css";
import { fontFaces, Typography, TypographyMobile } from "./fonts.css";

export const globalStyle = (theme: AppTheme) => css`
  ${fontFaces}

  :root {
    --font-sans: "Funnel Display", system-ui, -apple-system, sans-serif;
    --font-display: var(--font-sans);
    --row-gap: ${theme.spacing["6xl"]};
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-sans);
  }

  html,
  body,
  #root {
    height: 100%;
    margin: 0;
    font-size: 16px;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${theme.colors.light};
    color: ${theme.colors.text};
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  main {
    flex: 1 0 auto;
    position: relative;
    z-index: ${theme.zIndex.page};

    @media (max-width: ${theme.breakPoints.mobile}) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  header,
  footer {
    flex: 0 0 auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  h1 {
    ${Typography.h1}
  }
  h2 {
    ${Typography.h2}
  }
  h3 {
    ${Typography.h3}
  }
  h4 {
    ${Typography.h4}
  }
  h5 {
    ${Typography.h5}
  }
  h6 {
    ${Typography.h6}
  }

  .font-funnel {
    font-family: var(--font-display);
  }

  @media (max-width: ${theme.breakPoints.mobile}) {
    h1 {
      ${TypographyMobile.h1}
    }
    h2 {
      ${TypographyMobile.h2}
    }
    h3 {
      ${TypographyMobile.h3}
    }
    h4 {
      ${TypographyMobile.h4}
    }
    h5 {
      ${TypographyMobile.h5}
    }
    h6 {
      ${TypographyMobile.h6}
    }
  }
`;

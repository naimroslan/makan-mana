import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme, bgColor?: string, textColor?: string) => {
  const resolvedBg = bgColor ?? theme.colors.gray[200];
  const resolvedText = textColor ?? theme.colors.gray[700];

  const label = css`
    display: inline-block;
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 999px;
    background: ${resolvedBg};
    color: ${resolvedText};
  `;

  return {
    label,
  };
};

export default getStyle;

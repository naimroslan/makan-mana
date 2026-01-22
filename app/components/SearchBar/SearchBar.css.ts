import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme) => {
  const wrapper = css`
    display: flex;
    align-items: center;
    background: ${theme.colors.white[0]};
    border-radius: 999px;
    padding: 0.75rem 1rem;
    box-shadow: ${theme.shadow.sm};
    border: 1px solid ${theme.colors.border};
  `;

  const input = css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${theme.colors.text};
    padding: 0 0.75rem;
    font-weight: 600;
    font-size: 1.05rem;

    &::placeholder {
      color: ${theme.colors.gray[500]};
    }
  `;

  const button = css`
    padding: 0.75rem 1rem;
    color: ${theme.colors.secondary};
    font-size: 1.2rem;
    font-weight: 700;
    transition: opacity 120ms ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return {
    wrapper,
    input,
    button,
  };
};

export default getStyle;

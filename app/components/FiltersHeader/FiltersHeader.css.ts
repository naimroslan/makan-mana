import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme, hasActiveFilters: boolean) => {
  const wrapper = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const left = css`
    display: flex;
    align-items: center;
    gap: 0.35rem;
  `;

  const title = css`
    color: ${theme.colors.text};
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  `;

  const subtitle = css`
    font-size: 0.9rem;
    color: ${theme.colors.gray[500]};
  `;

  const iconButton = css`
    padding: 0.25rem;
    color: ${theme.colors.gray[500]};
    transition: color 120ms ease;

    &:hover {
      color: ${theme.colors.text};
    }
  `;

  const right = css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;

  const reset = css`
    font-size: 0.95rem;
    color: ${theme.colors.text};
    text-decoration: underline;
    transition: opacity 120ms ease;

    &:hover {
      opacity: 0.8;
    }
  `;

  const filterButton = css`
    padding: 0.25rem;
    color: ${hasActiveFilters ? theme.colors.text : theme.colors.gray[500]};
    transition: color 120ms ease;

    &:hover {
      color: ${theme.colors.text};
    }
  `;

  return {
    wrapper,
    left,
    title,
    subtitle,
    iconButton,
    right,
    reset,
    filterButton,
  };
};

export default getStyle;

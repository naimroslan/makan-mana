import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme, isLoading: boolean) => {
  const container = css`
    padding: 0 1rem;
    overflow-y: auto;
    max-height: 60vh;
  `;

  const heading = css`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${theme.colors.primary};
    margin-bottom: 1rem;
    text-align: left;
  `;

  const section = css`
    margin-bottom: 1rem;
  `;

  const sectionTitle = css`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.text};
    margin-bottom: 0.35rem;
  `;

  const pills = css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `;

  const pill = (selected: boolean) => css`
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.9rem;
    border: 1px solid
      ${selected ? theme.colors.primary : theme.colors.primaryLight};
    background: ${selected ? theme.colors.primary : theme.colors.light};
    color: ${selected ? theme.colors.white[0] : theme.colors.primary};
    transition:
      background 120ms ease,
      color 120ms ease,
      opacity 120ms ease;
    cursor: ${isLoading ? "not-allowed" : "pointer"};
    opacity: ${isLoading ? 0.6 : 1};

    &:hover {
      background: ${selected
        ? theme.colors.primaryDark
        : theme.colors.primaryLight};
      color: ${theme.colors.white[0]};
    }
  `;

  return {
    container,
    heading,
    section,
    sectionTitle,
    pills,
    pill,
  };
};

export default getStyle;

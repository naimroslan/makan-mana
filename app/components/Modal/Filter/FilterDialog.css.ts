import { css, type Theme } from "@emotion/react";

const getStyle = (
  theme: Theme,
  options: { hasSelections: boolean; isLoading: boolean },
) => {
  const { hasSelections, isLoading } = options;

  const buttonBase = css`
    width: 50%;
    padding: 0.65rem 1rem;
    border-radius: 999px;
    font-weight: 600;
    box-shadow: ${theme.shadow.sm};
    transition:
      background 150ms ease,
      color 150ms ease,
      opacity 120ms ease;
    border: 1px solid transparent;
    cursor: ${isLoading ? "not-allowed" : "pointer"};
    opacity: ${isLoading ? 0.7 : 1};
  `;

  const modalBody = css`
    padding: 1rem;
  `;

  const buttonContainer = css`
    width: 100%;
    padding: 0 1rem 1rem;
  `;

  const buttonRow = css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  `;

  const clearButton = [
    buttonBase,
    css`
      background: ${theme.colors.white[0]};
      color: ${theme.colors.primary};
      border-color: ${theme.colors.primaryLight};

      &:hover {
        background: ${theme.colors.primaryLight};
        color: ${theme.colors.white[0]};
      }

      ${!hasSelections ? "opacity: 0.6; cursor: not-allowed;" : ""}
    `,
  ];

  const applyButton = [
    buttonBase,
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.white[0]};

      &:hover {
        background: ${theme.colors.primaryDark};
      }

      ${!hasSelections ? "opacity: 0.6; cursor: not-allowed;" : ""}
    `,
  ];

  return {
    modalBody,
    buttonContainer,
    buttonRow,
    clearButton,
    applyButton,
  };
};

export default getStyle;

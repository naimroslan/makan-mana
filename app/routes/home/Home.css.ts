import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme) => {
  const container = css`
    min-height: 100vh;
    background-color: #f6f7f8;
    display: flex;
    flex-direction: column;
  `;

  const main = css`
    flex: 1;
    padding: 2.5rem 1.25rem 6rem;
    overflow: auto;
    display: flex;
    justify-content: center;
  `;

  const content = css`
    width: 100%;
    max-width: 26rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  `;

  const rollerWrapper = css`
    position: relative;
    margin-top: 0.5rem;
  `;

  const rollButton = css`
    width: 100%;
    padding: 1.1rem 1.5rem;
    border: none;
    border-radius: 0 0 0.9rem 0.9rem;
    color: #fff;
    font-weight: 700;
    font-size: 1.25rem;
    transition:
      transform 150ms ease,
      background-color 150ms ease,
      opacity 150ms ease;
  `;

  const rollButtonActive = css`
    background-color: #131313;

    &:hover {
      background-color: color-mix(in srgb, #131313 90%, #fff 10%);
    }

    &:active {
      transform: scale(0.97);
    }
  `;

  const rollButtonDisabled = css`
    background-color: #d1d5db;
    cursor: not-allowed;
    opacity: 0.85;
  `;

  const selectionContainer = css`
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 0.9rem;
    text-align: center;
  `;

  const selectionText = css`
    color: #0f172a;
  `;

  const selectionHighlight = css`
    font-weight: 700;
    color: #0f172a;
  `;

  const statusWrapper = css`
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
  `;

  return {
    container,
    main,
    content,
    rollerWrapper,
    rollButton,
    rollButtonActive,
    rollButtonDisabled,
    selectionContainer,
    selectionText,
    selectionHighlight,
    statusWrapper,
  };
};

export default getStyle;

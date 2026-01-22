import { css, type Theme } from "@emotion/react";

const getStyle = (
  theme: Theme,
  height: string,
  withButton: boolean,
  floatingButton: boolean,
) => {
  const overlay = css`
    position: fixed;
    inset: 0;
    z-index: ${theme.zIndex.modal};
    overflow: hidden;
  `;

  const backdrop = css`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    opacity: 0;
  `;

  const sheet = css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${height};
    background: ${theme.colors.white[0]};
    border-radius: 1.75rem 1.75rem 0 0;
    padding: 1rem 1rem 1.5rem;
    box-shadow: ${theme.shadow.lg};
    display: flex;
    flex-direction: column;
  `;

  const handle = css`
    width: 2.5rem;
    height: 0.35rem;
    background: ${theme.colors.gray[300]};
    border-radius: 999px;
    margin: 0 auto 1rem;
  `;

  const content = css`
    overflow-y: auto;
    padding-bottom: ${withButton && floatingButton ? "3rem" : "1.5rem"};
  `;

  const buttonWrapper = css`
    ${floatingButton
      ? "position: absolute; left: 1rem; right: 1rem; bottom: 1.5rem;"
      : "margin-top: 1rem; padding: 0 1rem;"}
  `;

  const button = css`
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 0.9rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.white[0]};
    font-weight: 600;
    text-align: center;
    transition: background 150ms ease;

    &:hover {
      background: ${theme.colors.primaryDark};
    }
  `;

  return {
    overlay,
    backdrop,
    sheet,
    handle,
    content,
    buttonWrapper,
    button,
  };
};

export default getStyle;

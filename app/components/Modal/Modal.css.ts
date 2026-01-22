import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme, resolvedWidth: string, scrollable: boolean) => {
  const overlay = css`
    position: fixed;
    inset: 0;
    z-index: ${theme.zIndex.modal};
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  `;

  const dialog = css`
    position: relative;
    width: 100%;
    max-width: ${resolvedWidth};
    background: ${theme.colors.white[0]};
    border: 1px solid ${theme.colors.border};
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: ${theme.shadow.md};
    ${scrollable ? "max-height: 80vh; overflow-y: auto;" : ""}
  `;

  const close = css`
    position: absolute;
    top: 0.75rem;
    right: 1rem;
    font-size: 1.25rem;
    color: ${theme.colors.gray[600]};
    cursor: pointer;
    transition: color 120ms ease;

    &:hover {
      color: ${theme.colors.primary};
    }
  `;

  return {
    overlay,
    dialog,
    close,
  };
};

export default getStyle;

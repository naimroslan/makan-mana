import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme, VISIBLE_ITEM_HEIGHT: number) => {
  const wrapper = css`
    background: ${theme.colors.white[0]};
    border: 1px solid ${theme.colors.border};
    border-radius: 1.25rem;
    overflow: hidden;
    box-shadow: ${theme.shadow.sm};
  `;

  const frame = css`
    position: relative;
    height: 220px;
    overflow: hidden;
  `;

  const gradientTop = css`
    position: absolute;
    inset: 0 0 auto 0;
    height: ${VISIBLE_ITEM_HEIGHT}px;
    background: linear-gradient(
      to bottom,
      ${theme.colors.white[0]},
      transparent
    );
    z-index: 10;
    pointer-events: none;
  `;

  const gradientBottom = css`
    position: absolute;
    inset: auto 0 0 0;
    height: ${VISIBLE_ITEM_HEIGHT}px;
    background: linear-gradient(to top, ${theme.colors.white[0]}, transparent);
    z-index: 10;
    pointer-events: none;
  `;

  const list = css`
    position: absolute;
    top: ${VISIBLE_ITEM_HEIGHT}px;
    left: 0;
    right: 0;
    will-change: transform;
  `;

  const item = css`
    height: ${VISIBLE_ITEM_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      opacity 150ms ease,
      color 150ms ease;
  `;

  const loading = css`
    height: ${VISIBLE_ITEM_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.gray[500]};
    font-size: 1.1rem;
  `;

  return {
    wrapper,
    frame,
    gradientTop,
    gradientBottom,
    list,
    item,
    loading,
  };
};

export default getStyle;

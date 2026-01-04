import { css, type Theme } from "@emotion/react";

const getStyle = (theme: Theme) => {
  const wrapper = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `;

  const title = css`
    font-size: 24px;
    line-height: 1.1;
    font-weight: 700;
    color: #0f172a;
  `;

  const actions = css`
    display: flex;
    gap: 0.5rem;
    padding-top: 0.25rem;
  `;

  const iconButton = css`
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #fff;
    color: #0f172a;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
    border: 1px solid #e2e8f0;
  `;

  return {
    wrapper,
    title,
    actions,
    iconButton,
  };
};

export default getStyle;

import { css, useTheme } from "@emotion/react";
import type { BadgeProps } from "@Types/components/Badge.type";
import getStyle from "./Badge.css";

const Badge = ({ label, bgColor, textColor }: BadgeProps) => {
  const theme = useTheme();
  const styles = getStyle(theme, bgColor, textColor);

  return <span css={styles.label}>{label}</span>;
};

export default Badge;

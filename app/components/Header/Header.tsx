import { FiBell, FiMail } from "react-icons/fi";
import { useTheme } from "@emotion/react";
import getStyle from "./Header.css";

export default function Header() {
  const theme = useTheme();
  const styles = getStyle(theme);

  return (
    <header css={styles.wrapper}>
      <h1 css={styles.title}>
        Find your
        <br />
        favorite place
      </h1>

      <div css={styles.actions}>
        <button css={styles.iconButton}>
          <FiBell size={18} />
        </button>
        <button css={styles.iconButton}>
          <FiMail size={18} />
        </button>
      </div>
    </header>
  );
}

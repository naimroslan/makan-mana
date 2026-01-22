import { useTheme } from "@emotion/react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import getStyle from "@Components/SearchBar/SearchBar.css";

const SearchBar = ({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) => {
  const theme = useTheme();
  const styles = getStyle(theme);

  return (
    <div css={styles.wrapper}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSearch()}
        css={styles.input}
        placeholder="What are you in the mood to eat?"
      />
      <button onClick={onSearch} disabled={!value.trim()} css={styles.button}>
        <FaWandMagicSparkles />
      </button>
    </div>
  );
};

export default SearchBar;

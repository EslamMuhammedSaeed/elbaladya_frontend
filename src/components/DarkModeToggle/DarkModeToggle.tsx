import { useDarkMode } from "@context/DarkModeContext";
import styles from "./DarkModeToggle.module.scss";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <span className={styles.slider}>
        <span
          className={`${styles.icon} ${isDark ? styles.dark : styles.light}`}
        >
          {isDark ? <FaMoon /> : <FaSun />}
        </span>
      </span>
    </label>
  );
}

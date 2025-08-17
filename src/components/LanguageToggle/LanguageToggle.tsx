import { useTranslation } from "react-i18next";
import styles from "./LanguageToggle.module.scss";
import { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  // Load saved lang or fall back to i18n.language or "en"
  const initialLang =
    localStorage.getItem("appLanguage") || i18n.language || "en";
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    // Save to localStorage and update HTML attributes
    localStorage.setItem("appLanguage", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <div className={styles.switchWrapper} onClick={toggleLang}>
      {/* <div
        className={`${styles.toggle} ${lang === "ar" ? styles.ar : styles.en}`}
      >
        <div className={styles.thumb}>{lang.toUpperCase()}</div>
      </div> */}
      <MdLanguage className={styles.languageIcon} />
    </div>
  );
}

import AppRoutes from "@routes/AppRoutes";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import LanguageToggle from "@components/LanguageToggle/LanguageToggle";
// import DarkModeToggle from "@components/DarkModeToggle/DarkModeToggle";

function App() {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return (
    <div className={`app-root ${direction}`}>
      {/* <LanguageToggle /> */}
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;

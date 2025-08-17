import { useState, useEffect, useCallback } from "react";
import styles from "./MainLayout.module.scss";
import Sidebar from "@components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import DarkModeToggle from "@components/DarkModeToggle/DarkModeToggle";
import LanguageToggle from "@components/LanguageToggle/LanguageToggle";
import { useTranslation } from "react-i18next";
import GlobalSearchInput from "@components/SearchInput/GlobalSearchInput";

export default function MAinLayout() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pageHeader, setPageHeader] = useState<{
    title: string;
    icon?: React.ReactNode;
  }>({
    title: "Dashboard",
  });
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openMobileSidebar = () => setIsMobileOpen(true);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsMobileOpen(false);
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSetPageHeader = useCallback(
    (title: string, icon?: React.ReactNode) => {
      setPageHeader((prev) => {
        if (prev.title === title && prev.icon === icon) return prev;
        return { title, icon };
      });
    },
    []
  );
  // useEffect(() => {
  //   if (!isSidebarOpen) console.log(isSidebarOpen);
  // }, [isSidebarOpen]);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileOpen}
        toggleCollapse={toggleSidebar}
        closeMobile={closeMobileSidebar}
      />

      <div
        className={`${styles.main} ${!isSidebarOpen ? styles.collapsed : ""} ${
          isMobileOpen ? styles.blurred : ""
        }`}
      >
        {/* <div className={styles.mobileHeader}>
          <button onClick={openMobileSidebar}>☰</button>
        </div> */}
        <div className={styles.topBar}>
          <nav className={styles.nav}>
            <div className="d-flex align-items-center gap-2">
              <button className={styles.burger} onClick={toggleSidebar}>
                ☰
              </button>
              <button
                className={styles.burgerMobile}
                onClick={openMobileSidebar}
              >
                ☰
              </button>

              <div className={styles.title}>
                {pageHeader.icon && pageHeader.icon}
                {t(`sidebar.${pageHeader.title}`)}
              </div>
            </div>
            <GlobalSearchInput />
            <div className={styles.toggles}>
              <LanguageToggle />

              <DarkModeToggle />
            </div>
          </nav>
        </div>
        <div className={styles.content}>
          <Outlet context={handleSetPageHeader} />
        </div>
      </div>
    </div>
  );
}

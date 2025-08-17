import { useEffect } from "react";
import styles from "./Sidebar.module.scss";
import { FaTimes } from "react-icons/fa";
// import logo from "@assets/images/logo.svg";
import new_logo from "@assets/images/new_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbLogout, TbReportAnalytics } from "react-icons/tb";
import { BsHeadsetVr } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { IoMdPeople } from "react-icons/io";
import unknownUser from "@assets/images/unknown_user.png";
import { useAuth } from "@context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  // setShowModal: (show: boolean) => void;
  toggleCollapse: () => void;
  closeMobile: () => void;
}

export default function Sidebar({
  isOpen,
  isMobileOpen,
  // setShowModal,
  // toggleCollapse,
  closeMobile,
}: SidebarProps) {
  const { i18n, t } = useTranslation();
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  // useEffect(() => {
  //   console.log(isOpen);
  // }, [isMobileOpen]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
  }, [isMobileOpen]);

  return (
    <>
      <div
        className={`${styles.sidebar}
        ${isOpen || isMobileOpen ? styles.expanded : styles.collapsed}
        
        ${dir === "rtl" ? styles.rtl : styles.ltr}`}
      >
        {/* Mobile Collapse Button - appears beside sidebar */}
        {isMobileOpen && (
          <button
            className={`${styles.mobileCollapseBtn} ${
              dir === "rtl" ? styles.rtl : styles.ltr
            }`}
            onClick={closeMobile}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        )}

        <div className={styles.topBar}>
          {/* Removed duplicate close button since we have the collapse button outside */}
        </div>

        <div className={styles.sideBarHeader}>
          <img className="img-fluid px-5" src={new_logo} alt="Logo" />
        </div>

        {(isOpen || isMobileOpen) && (
          <nav className={styles.nav}>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <IoHome />
              <span>{t("sidebar.dashboard")}</span>
            </NavLink>

            <NavLink
              to="/trainings"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <HiOutlineClipboardDocumentList />
              <span>{t("sidebar.trainings")}</span>
            </NavLink>
            <NavLink
              to="/admins"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <IoMdPeople />
              <span>{t("sidebar.admins")}</span>
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <GrGroup />
              <span>{t("sidebar.groups")}</span>
            </NavLink>

            <NavLink
              to="/trainees"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <IoMdPeople />
              <span>{t("sidebar.trainees")}</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <TbReportAnalytics />
              <span>{t("sidebar.reports")}</span>
            </NavLink>

            <NavLink
              to="/vr"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <BsHeadsetVr />
              <span>{t("sidebar.vr")}</span>
            </NavLink>

            <NavLink
              to="/certificates"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <IoMdPeople />
              <span>{t("sidebar.certificates")}</span>
            </NavLink>

            {/* <div className={styles.divider}></div> */}

            {/* <button onClick={() => setShowModal(true)} className={styles.link}>
              <IoPerson />
              <span>{t("sidebar.addUser")}</span>
            </button> */}

            {/* <NavLink
              to="/info"
              className={({ isActive }) =>
                `${isActive ? styles.sidebarActive : ""} ${styles.link}`
              }
            >
              <GrContactInfo />
              <span>{t("sidebar.info")}</span>
            </NavLink> */}
          </nav>
        )}
        <footer className={styles.footer}>
          <div className={styles.userInfo}>
            <img src={unknownUser} alt="user" className={styles.profilePhoto} />

            <div className={styles.profileData}>
              <p className={styles.name}>{admin?.name || "محمد بن عمر"}</p>
              <p className={styles.jobTitle}>{t("sidebar.admin")}</p>
            </div>
          </div>
          {/* Example: Language Toggle or Logout */}

          <button className={` ${styles.logout}`} onClick={handleLogout}>
            <TbLogout />
            <span>{t("sidebar.logout")}</span>
          </button>
        </footer>
      </div>

      {/* Backdrop for mobile - clicking outside closes sidebar */}
      {isMobileOpen && (
        <div className={styles.backdrop} onClick={closeMobile} />
      )}
    </>
  );
}

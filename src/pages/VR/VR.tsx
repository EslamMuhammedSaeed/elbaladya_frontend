import React from "react";
// import { useTranslation } from "react-i18next";
import VRHeadsets from "../../components/VRHeadsets";
import styles from "./VR.module.scss";

const VR: React.FC = () => {
  // const { t } = useTranslation();

  return (
    <div className={styles.vrPage}>
      {/* <div className={styles.header}>
        <h1 className={styles.title}>{t("vr_headsets.title")}</h1>
        <p className={styles.subtitle}>{t("vr_headsets.subtitle")}</p>
      </div> */}

      <div className={styles.content}>
        <VRHeadsets />
      </div>
    </div>
  );
};

export default VR;

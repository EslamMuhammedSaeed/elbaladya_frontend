import React from "react";
import CertificateGenerator from "../../components/CertificateGenerator";
import styles from "./Certificates.module.scss";

const Certificates: React.FC = () => {
  // const { t } = useTranslation();

  return (
    <div className={styles.certificatesContainer}>
      {/* <div className={styles.header}>
        <h1>{t("certificates.title")}</h1>
        <p>{t("certificates.description")}</p>
      </div> */}

      <div className={styles.content}>
        <CertificateGenerator />
      </div>
    </div>
  );
};

export default Certificates;

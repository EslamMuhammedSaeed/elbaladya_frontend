import React from "react";
import CertificateGenerator from "../../components/CertificateGenerator";
import styles from "./CertificateGeneratorPage.module.scss";

const CertificateGeneratorPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>مولد الشهادات</h1>
        <p className={styles.subtitle}>
          قم بإنشاء شهادات تدريب احترافية للمتدربين
        </p>
      </div>

      <CertificateGenerator />
    </div>
  );
};

export default CertificateGeneratorPage;

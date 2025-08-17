import React from "react";
import styles from "./AddUserModal.module.scss";

const StepTwo: React.FC = () => {
  return (
    <div className={styles.uploadBox}>
      <p>Employee photo</p>
      <div className={styles.uploadArea}>
        <p>اسحب وأفلت الصورة هنا أو تصفح من الملفات</p>
        <button className={styles.uploadBtn}>أضف صورة</button>
      </div>
    </div>
  );
};

export default StepTwo;

import React from "react";
import styles from "./AddUserModal.module.scss";
import CreateUserInput from "@components/PasswordInput/CreateUserInput";
import { useTranslation } from "react-i18next";

const StepOne: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.step}>
      {/* <div className="d-flex gap-2 w-100"> */}
      <div className={styles.formGroup}>
        <label>{t("addUserModal.name")}</label>
        <input type="text" name="name" />
      </div>

      {/* </div> */}

      <div className={styles.formGroup}>
        <label>{t("addUserModal.email")}</label>
        <input type="email" autoComplete="off" name="email" />
      </div>
      <div className="d-flex gap-2">
        <div className={styles.formGroup}>
          <label>{t("addUserModal.password")}</label>
          <CreateUserInput
            type="password"
            name="password"
            value=""
            onChange={() => {}}
          />
        </div>
        <div className={styles.formGroup}>
          <label>{t("addUserModal.confirmPassword")}</label>
          <CreateUserInput
            type="password"
            name="confirm_password"
            value=""
            onChange={() => {}}
          />

          {/* <span className={styles.error}>غير متطابق</span> */}
        </div>
      </div>
    </div>
  );
};

export default StepOne;

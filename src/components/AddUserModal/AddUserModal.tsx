import React, { useState } from "react";
import styles from "./AddUserModal.module.scss";
import AddUserForm from "./AddUserForm";
import { PiStudent } from "react-icons/pi";
import { IoPersonAddOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import AddStudentForm from "./AddStudentForm";

type UserType = "trainee" | "employee" | null;

const AddUserModal: React.FC<{
  onClose: () => void;
  userTypeProp?: UserType;
  refetch: () => void;
  adminsOptions?: { label: string; value: string }[];
  groupsOptions?: { label: string; value: string }[];
}> = ({ onClose, userTypeProp, refetch, adminsOptions, groupsOptions }) => {
  const [userType, setUserType] = useState<UserType>(
    userTypeProp || "employee"
  );
  const { t } = useTranslation();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {!userType ? (
          <>
            <div className={styles.header}>
              <h2>{t("addUserModal.add")}</h2>
              <button className={styles.exit} onClick={onClose}>
                {t("addUserModal.exit")}
              </button>
            </div>
            <div className={styles.options}>
              <div
                className={styles.optionCard}
                onClick={() => setUserType("employee")}
              >
                <span>{t("addUserModal.addEmployee")}</span>
                <span className={styles.icon}>
                  <IoPersonAddOutline />
                </span>
              </div>
              <div
                className={styles.optionCard}
                onClick={() => setUserType("trainee")}
              >
                <span>{t("addUserModal.addTrainee")}</span>
                <span className={styles.icon}>
                  <PiStudent />
                </span>
              </div>
            </div>
          </>
        ) : userType === "employee" ? (
          <AddUserForm
            userType={userType}
            onClose={onClose}
            refetch={refetch}
            groupsOptions={groupsOptions || []}
          />
        ) : (
          <AddStudentForm
            userType={userType}
            onClose={onClose}
            refetch={refetch}
            adminsOptions={adminsOptions || []}
            groupsOptions={groupsOptions || []}
          />
        )}
      </div>
    </div>
  );
};

export default AddUserModal;

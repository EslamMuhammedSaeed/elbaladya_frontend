import React, { useState } from "react";

import styles from "./AddUserModal.module.scss";
import { useTranslation } from "react-i18next";
import CreateUserInput from "@components/PasswordInput/CreateUserInput";
import { useMutation } from "@apollo/client";
import { CREATE_ADMIN } from "@mutations/admins/createAdmin";
import { toast } from "react-toastify";
import Skeleton from "@components/Skeleton/Skeleton";
import CreateUserSelectInput from "@components/PasswordInput/CreateUserSelectInput";

type Props = {
  userType: "employee" | "trainee" | null;
  onClose: () => void;
  refetch: () => void;
  groupsOptions: { label: string; value: string }[];
};

const AddUserForm: React.FC<Props> = ({
  onClose,
  userType,
  refetch,
  groupsOptions,
}) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    groupId: "",
  });

  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    groupId: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    groupId: "",
  });
  // const loading = true;

  const [createAdmin, { loading }] = useMutation(CREATE_ADMIN, {
    onCompleted: () => {
      toast.success(t("addUserModal.success"), {
        theme: "colored",
        autoClose: 100000,
        pauseOnHover: true,
        draggable: true,
        rtl: i18n.dir() === "rtl",
      });
      refetch();
    },
    onError: (error) => {
      console.error("Create error", error);

      toast.error(
        t(`addUserModal.${error.message}`) || t("addUserModal.error"),
        {
          theme: "colored",
          autoClose: 100000,
          pauseOnHover: true,
          draggable: true,
          rtl: i18n.dir() === "rtl",
        }
      );
    },
  });

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirm_password?: string;
      groupId?: string;
    } = {};
    if (!formData.name) {
      errors.name = t("addUserModal.nameRequired");
    }
    if (!formData.email) {
      errors.email = t("addUserModal.emailRequired");
    }
    if (!formData.password) {
      errors.password = t("addUserModal.passwordRequired");
    } else {
      // Password strength validation
      const hasMinLength = formData.password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (
        !hasMinLength ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber ||
        !hasSpecialChar
      ) {
        errors.password = t("addUserModal.passwordStrengthRequired");
      }
    }
    if (!formData.confirm_password) {
      errors.confirm_password = t("addUserModal.confirmPasswordRequired");
    }
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = t("addUserModal.passwordMismatch");
    }
    if (!formData.groupId) {
      errors.groupId = t("addUserModal.groupIdRequired");
    }
    setErrors({
      name: errors.name || "",
      email: errors.email || "",
      password: errors.password || "",
      confirm_password: errors.confirm_password || "",
      groupId: errors.groupId || "",
    });
    console.log("errors", Object.keys(errors).length);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     console.log(formData);
  //   }
  // };

  const handleSubmit = async () => {
    if (validateForm()) {
      const { name, email, password, groupId } = formData;
      const hashedPassword = password;
      await createAdmin({
        variables: { name, email, hashedPassword, groupId },
      });
      // console.log(data);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h2>
          {t(
            `addUserModal.add${
              userType === "employee" ? "Employee" : "Trainee"
            }`
          )}
        </h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.step}>
          {/* <div className="d-flex gap-2 w-100"> */}
          <div className="d-flex gap-2">
            <div className={styles.formGroup}>
              <label>{t("addUserModal.name")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </>
              )}
            </div>
            <div className={`${styles.formGroup} flex-grow-1`}>
              <label>{t("addUserModal.group")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <CreateUserSelectInput
                    placeholder="اختر المجموعة"
                    options={groupsOptions || []}
                    value={formData.groupId}
                    onSelect={(val) => {
                      setFormData({ ...formData, groupId: val });
                      setErrors({ ...errors, groupId: "" });
                    }}
                  />
                  {errors.groupId && (
                    <span className={styles.error}>{errors.groupId}</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* </div> */}

          <div className={styles.formGroup}>
            <label>{t("addUserModal.email")}</label>
            {loading ? (
              <Skeleton height={40} width="100%" />
            ) : (
              <>
                <input
                  type="email"
                  autoComplete="off"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </>
            )}
          </div>
          <div className="d-flex gap-2">
            <div className={`${styles.formGroup} flex-grow-1`}>
              <label>{t("addUserModal.password")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <CreateUserInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    showStrengthIndicator={true}
                  />
                  {errors.password && (
                    <span className={styles.error}>{errors.password}</span>
                  )}
                </>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>{t("addUserModal.confirmPassword")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <CreateUserInput
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  {errors.confirm_password && (
                    <span className={styles.error}>
                      {errors.confirm_password}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.back}>
          {loading ? (
            <Skeleton height={40} width={120} />
          ) : (
            <button onClick={onClose} className={styles.cancel}>
              {t("addUserModal.exit")}
            </button>
          )}
        </div>

        {loading ? (
          <Skeleton height={40} width={160} />
        ) : (
          <button onClick={handleSubmit} className={styles.next}>
            {t("addUserModal.submit")}
          </button>
        )}
      </div>
    </>
  );
};

export default AddUserForm;

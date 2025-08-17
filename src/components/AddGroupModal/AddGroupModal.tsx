import React, { useState } from "react";
import styles from "./AddGroupModal.module.scss";
import { useTranslation } from "react-i18next";
import Skeleton from "@components/Skeleton/Skeleton";
import { CREATE_GROUP } from "@mutations/groups/createGroup";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import CreateUserSelectInput from "@components/PasswordInput/CreateUserSelectInput";

interface AddGroupModalProps {
  onClose: () => void;
  refetch: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ onClose, refetch }) => {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<{
    name: string;
    category: string;
  }>({
    name: "",
    category: "",
  });

  const [createGroup, { loading }] = useMutation(CREATE_GROUP, {
    onCompleted: () => {
      toast.success(t("addGroupModal.success"), {
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
        t(`addGroupModal.${error.message}`) || t("addUserModal.error"),
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
      category?: string;
    } = {};
    if (!name) {
      errors.name = t("addUserModal.nameRequired");
    }
    if (!category) {
      errors.category = t("addGroupModal.categoryRequired");
    }

    setErrors({
      name: errors.name || "",
      category: errors.category || "",
    });
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (validateForm()) {
      await createGroup({
        variables: { name, category },
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{t("addGroupModal.addGroup")}</h2>
        </div>

        <div className={styles.formContent}>
          <div className={styles.step}>
            {/* <div className="d-flex gap-2 w-100"> */}
            <div className={styles.formGroup}>
              <label>{t("addUserModal.name")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({ ...errors, name: "" });
                    }}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </>
              )}
            </div>
            <div className={`${styles.formGroup} flex-grow-1`}>
              <label>{t("addGroupModal.category")}</label>
              {loading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <CreateUserSelectInput
                    placeholder="اختر النوع"
                    options={[
                      { label: t("addGroupModal.student"), value: "student" },
                      { label: t("addGroupModal.admin"), value: "admin" },
                    ]}
                    value={category}
                    onSelect={(val) => {
                      setCategory(val);
                      setErrors({ ...errors, category: "" });
                    }}
                  />
                  {errors.category && (
                    <span className={styles.error}>{errors.category}</span>
                  )}
                </>
              )}
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
            <button onClick={handleCreate} className={styles.next}>
              {t("addUserModal.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;

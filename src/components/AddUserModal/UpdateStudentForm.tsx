import React, { useState } from "react";

import styles from "./AddUserModal.module.scss";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Skeleton from "@components/Skeleton/Skeleton";
import CreateUserSelectInput from "@components/PasswordInput/CreateUserSelectInput";
// import { GET_ALL_GROUPS_NOT_PAGINATED } from "@quiries/groups/getAllGroups";
// import { GET_ALL_ADMINS_NOT_PAGINATED } from "@quiries/admins/getAllAdmins";
import PhoneInput from "@components/PasswordInput/PhoneInput";
import type { StudentInfo } from "@utils/types";
import { UPDATE_STUDENT } from "@mutations/students/updateStudent";

type Props = {
  userType: "employee" | "trainee" | null;
  onClose: () => void;
  refetch: () => void;
  adminsOptions: { label: string; value: string }[];
  groupsOptions: { label: string; value: string }[];
  student: StudentInfo;
};

const UpdateStudentForm: React.FC<Props> = ({
  onClose,
  userType,
  refetch,
  adminsOptions,
  groupsOptions,
  student,
}) => {
  const { t, i18n } = useTranslation();
  //   const [groupsHasFetched, setGroupsHasFetched] = useState(false);
  //   const [adminsHasFetched, setAdminsHasFetched] = useState(false);

  const [formData, setFormData] = useState({
    name: student.name,
    groupId: student.groupId || "",
    facultyId: student.facultyId,
    phone: student.phone,
    adminId: student.adminId || "",
    stage: student.stage,
    hadTutorial: false,
    lastAttempt: student.lastAttempt,
    badges: student.badges,
    points: student.points,
  });

  // console.log(student);

  const [errors, setErrors] = useState<{
    name: string;
    groupId: string;
    facultyId: string;
    phone: string;
    adminId: string;
    stage: string;
    hadTutorial?: boolean;
    lastAttempt?: string;
    badges?: string;
    points?: string;
  }>({
    name: "",
    groupId: "",
    facultyId: "",
    phone: "",
    adminId: "",
    stage: "",
    hadTutorial: false,
    lastAttempt: "",
    badges: "",
    points: "",
  });
  // const loading = true;

  const [updateStudent, { loading }] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => {
      toast.success(t("updateUserModal.success"), {
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
        t(`addUserModal.${error.message}`) || t("updateUserModal.error"),
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
  // const { data: groups } = useQuery(GET_ALL_GROUPS_NOT_PAGINATED, {
  //   fetchPolicy: "network-only",
  //   // skip: groupsHasFetched,
  //   // onCompleted: () => {
  //   //   setGroupsHasFetched(true);
  //   // },
  // });
  // const groupsOptions = groups?.getAllGroups?.data.map(
  //   (group: { name: string; id: string }) => ({
  //     label: group.name,
  //     value: group.id,
  //   })
  // );
  // const { data: admins } = useQuery(GET_ALL_ADMINS_NOT_PAGINATED, {
  //   fetchPolicy: "network-only",
  //   // skip: adminsHasFetched,
  //   // onCompleted: () => {
  //   //   setAdminsHasFetched(true);
  //   // },
  // });
  // const adminsOptions = admins?.getAllAdminsNotPaginated?.data.map(
  //   (admin: { name: string; id: string }) => ({
  //     label: admin.name,
  //     value: admin.id,
  //   })
  // );

  //   useEffect(() => {
  //     console.log("options", adminsOptions, groupsOptions);
  //   }, [adminsOptions, groupsOptions]);

  const validateForm = () => {
    const errors: {
      name?: string;
      groupId?: string;
      facultyId?: string;
      phone?: string;
      adminId?: string;
      hadTutorial?: boolean;
      lastAttempt?: string;
      badges?: string;
      points?: string;
      stage?: string;
    } = {};
    if (!formData.name) {
      errors.name = t("addUserModal.nameRequired");
    }
    if (!formData.groupId) {
      errors.groupId = t("addUserModal.groupIdRequired");
    }
    if (!formData.facultyId) {
      errors.facultyId = t("addUserModal.facultyIdRequired");
    }
    if (!formData.phone) {
      errors.phone = t("addUserModal.phoneRequired");
    }
    if (!formData.adminId) {
      errors.adminId = t("addUserModal.adminIdRequired");
    }
    if (!formData.stage) {
      errors.stage = t("addUserModal.stageRequired");
    }
    setErrors({
      name: errors.name || "",
      groupId: errors.groupId || "",
      facultyId: errors.facultyId || "",
      phone: errors.phone || "",
      adminId: errors.adminId || "",
      stage: errors.stage || "",
    });
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "badges" || e.target.name === "points") {
      setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
      const {
        name,
        groupId,
        facultyId,
        phone,
        adminId,
        stage,
        hadTutorial,
        lastAttempt,
        badges,
        points,
      } = formData;
      await updateStudent({
        variables: {
          id: student.id,
          name,
          groupId,
          facultyId,
          phone,
          adminId,
          stage,
          hadTutorial,
          lastAttempt,
          badges,
          points,
        },
      });
      // console.log(data);
    }
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>
              {t(
                `addUserModal.update${
                  userType === "employee" ? "Employee" : "Trainee"
                }`
              )}

              <span className={`${styles.userId} mx-2`}>{student.id}</span>
            </h2>
          </div>

          <div className={styles.formContent}>
            <div className={styles.step}>
              {/* <div className="d-flex gap-2 w-100"> */}
              <div className="d-flex gap-2">
                <div className={`${styles.formGroup} flex-grow-1 col-6`}>
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
                        className="w-100"
                      />
                      {errors.name && (
                        <span className={styles.error}>{errors.name}</span>
                      )}
                    </>
                  )}
                </div>
                <div className={`${styles.formGroup} flex-grow-1 col-6`}>
                  <label>{t("addUserModal.stage")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <CreateUserSelectInput
                        placeholder={t("addUserModal.chooseStage")}
                        options={[
                          { label: t("table.stage_1"), value: "stage_1" },
                          { label: t("table.stage_2"), value: "stage_2" },
                        ]}
                        value={formData.stage}
                        onSelect={(val) => {
                          setFormData({ ...formData, stage: val });
                          setErrors({ ...errors, stage: "" });
                        }}
                      />
                      {errors.stage && (
                        <span className={styles.error}>{errors.stage}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* </div> */}
              <div className="d-flex gap-2">
                <div className={styles.formGroup}>
                  <label>{t("addUserModal.facultyId")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="text"
                        autoComplete="off"
                        name="facultyId"
                        value={formData.facultyId}
                        onChange={handleChange}
                      />
                      {errors.facultyId && (
                        <span className={styles.error}>{errors.facultyId}</span>
                      )}
                    </>
                  )}
                </div>

                <div className={`${styles.formGroup} flex-grow-1`}>
                  <label>{t("addUserModal.phone")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <PhoneInput
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                      />

                      {errors.phone && (
                        <span className={styles.error}>{errors.phone}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <div className={`${styles.formGroup} flex-grow-1`}>
                  <label>{t("addUserModal.group")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <CreateUserSelectInput
                        placeholder="اختر المجموعة"
                        options={groupsOptions || []}
                        value={formData.groupId || ""}
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
                <div className={`${styles.formGroup} flex-grow-1`}>
                  <label>{t("addUserModal.admin")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <CreateUserSelectInput
                        placeholder="اختر المشرف"
                        options={adminsOptions || []}
                        value={formData.adminId || ""}
                        onSelect={(val) => {
                          setFormData({ ...formData, adminId: val });
                          setErrors({ ...errors, adminId: "" });
                        }}
                      />
                      {errors.adminId && (
                        <span className={styles.error}>{errors.adminId}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <div className={styles.formGroup}>
                  <label>{t("addUserModal.points")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        name="points"
                        value={formData.points?.toString() || ""}
                        onChange={handleChange}
                      />
                      {errors.points && (
                        <span className={styles.error}>{errors.points}</span>
                      )}
                    </>
                  )}
                </div>
                <div className={`${styles.formGroup} flex-grow-1`}>
                  <label>{t("addUserModal.badges")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        name="badges"
                        value={formData.badges?.toString() || ""}
                        onChange={handleChange}
                      />
                      {errors.badges && (
                        <span className={styles.error}>{errors.badges}</span>
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
                {t("addUserModal.update")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStudentForm;

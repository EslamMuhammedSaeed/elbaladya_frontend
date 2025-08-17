import React, { useState } from "react";

import styles from "./AddUserModal.module.scss";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Skeleton from "@components/Skeleton/Skeleton";

import type { StudentCourse } from "@utils/types";
import { UPDATE_STUDENT_COURSE } from "@mutations/students/updateStudentCourse";

type Props = {
  onClose: () => void;
  refetch: () => void;
  studentCourse: StudentCourse | null;
};

const UpdateStudentCourseModal: React.FC<Props> = ({
  onClose,
  refetch,
  studentCourse,
}) => {
  const { t, i18n } = useTranslation();
  //   const [groupsHasFetched, setGroupsHasFetched] = useState(false);
  //   const [adminsHasFetched, setAdminsHasFetched] = useState(false);

  const [formData, setFormData] = useState({
    progress: studentCourse?.progress,
    timeSpentTraining: studentCourse?.timeSpentTraining,
    trainingResult: studentCourse?.trainingResult,
    testResult: studentCourse?.testResult,
    numberOfAttempts: studentCourse?.numberOfAttempts,
    numberOfAttemptsOnTests: studentCourse?.numberOfAttemptsOnTests,
    timeSpentOnExams: studentCourse?.timeSpentOnExams,
  });

  const [errors, setErrors] = useState<{
    progress: string;
    timeSpentTraining: string;
    trainingResult: string;
    testResult: string;
    numberOfAttempts: string;
    numberOfAttemptsOnTests: string;
    timeSpentOnExams: string;
  }>({
    progress: "",
    timeSpentTraining: "",
    trainingResult: "",
    testResult: "",
    numberOfAttempts: "",
    numberOfAttemptsOnTests: "",
    timeSpentOnExams: "",
  });
  // const loading = true;

  const [updateStudentCourse, { loading }] = useMutation(
    UPDATE_STUDENT_COURSE,
    {
      onCompleted: () => {
        toast.success(t("updateStudentCourseModal.success"), {
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
          t(`updateStudentCourseModal.${error.message}`) ||
            t("updateStudentCourseModal.error"),
          {
            theme: "colored",
            autoClose: 100000,
            pauseOnHover: true,
            draggable: true,
            rtl: i18n.dir() === "rtl",
          }
        );
      },
    }
  );
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
      progress?: string;
      timeSpentTraining?: string;
      trainingResult?: string;
      testResult?: string;
      numberOfAttempts?: string;
      numberOfAttemptsOnTests?: string;
      timeSpentOnExams?: string;
    } = {};
    if (!formData.progress && formData.progress !== 0) {
      errors.progress = t("updateStudentCourseModal.progressRequired");
    }
    if (!formData.timeSpentTraining && formData.timeSpentTraining !== 0) {
      errors.timeSpentTraining = t(
        "updateStudentCourseModal.timeSpentTrainingRequired"
      );
    }
    if (!formData.trainingResult && formData.trainingResult !== 0) {
      errors.trainingResult = t(
        "updateStudentCourseModal.trainingResultRequired"
      );
    }
    if (!formData.testResult && formData.testResult !== 0) {
      errors.testResult = t("updateStudentCourseModal.testResultRequired");
    }
    if (!formData.numberOfAttempts && formData.numberOfAttempts !== 0) {
      errors.numberOfAttempts = t(
        "updateStudentCourseModal.numberOfAttemptsRequired"
      );
    }
    if (
      !formData.numberOfAttemptsOnTests &&
      formData.numberOfAttemptsOnTests !== 0
    ) {
      errors.numberOfAttemptsOnTests = t(
        "updateStudentCourseModal.numberOfAttemptsOnTestsRequired"
      );
    }
    if (!formData.timeSpentOnExams && formData.timeSpentOnExams !== 0) {
      errors.timeSpentOnExams = t(
        "updateStudentCourseModal.timeSpentOnExamsRequired"
      );
    }

    if (formData.progress && formData.progress > 1) {
      console.log(formData.progress);
      errors.progress = t("updateStudentCourseModal.progressMax");
    }
    if (formData.trainingResult && formData.trainingResult > 100) {
      errors.trainingResult = t("updateStudentCourseModal.trainingResultMax");
    }
    if (formData.testResult && formData.testResult > 100) {
      errors.testResult = t("updateStudentCourseModal.testResultMax");
    }

    setErrors({
      progress: errors.progress || "",
      timeSpentTraining: errors.timeSpentTraining || "",
      trainingResult: errors.trainingResult || "",
      testResult: errors.testResult || "",
      numberOfAttempts: errors.numberOfAttempts || "",
      numberOfAttemptsOnTests: errors.numberOfAttemptsOnTests || "",
      timeSpentOnExams: errors.timeSpentOnExams || "",
    });
    return Object.keys(errors).length === 0;
  };

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.name === "progress") {
  //       setFormData({
  //         ...formData,
  //         [e.target.name]: Number(e.target.value) / 100,
  //       });
  //     } else {
  //       setFormData({ ...formData, [e.target.name]: e.target.value });
  //     }
  //     setErrors({
  //       ...errors,
  //       [e.target.name]: "",
  //     });
  //   };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Parse to number and handle progress scaling
    const parsedValue =
      name === "progress" ? Number(value) / 100 : Number(value);

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    setErrors({
      ...errors,
      [name]: "",
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
        progress,
        timeSpentTraining,
        trainingResult,
        testResult,
        numberOfAttempts,
        numberOfAttemptsOnTests,
        timeSpentOnExams,
      } = formData;
      await updateStudentCourse({
        variables: {
          id: studentCourse?.id || "",
          progress,
          timeSpentTraining,
          trainingResult,
          testResult,
          numberOfAttempts,
          numberOfAttemptsOnTests,
          timeSpentOnExams,
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
              {i18n.language === "ar"
                ? studentCourse?.course?.arabicName
                : studentCourse?.course?.englishName}
            </h2>
          </div>

          <div className={styles.formContent}>
            <div className={styles.step}>
              {/* <div className="d-flex gap-2 w-100"> */}
              <div className={`${styles.inputsRow} ${styles.progressRow}`}>
                <div className={`${styles.formGroup}`}>
                  <label>{t("updateStudentCourseModal.progress")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        name="progress"
                        value={formData.progress ? formData.progress * 100 : 0}
                        onChange={handleChange}
                        className="w-100"
                      />
                      {errors.progress && (
                        <span className={styles.error}>{errors.progress}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* </div> */}
              <div className={`${styles.inputsRow}`}>
                <div className={styles.formGroup}>
                  <label>{t("updateStudentCourseModal.trainingResult")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        autoComplete="off"
                        name="trainingResult"
                        min={0}
                        max={100}
                        className="w-100"
                        value={formData.trainingResult}
                        onChange={handleChange}
                      />
                      {errors.trainingResult && (
                        <span className={styles.error}>
                          {errors.trainingResult}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className={`${styles.formGroup}`}>
                  <label>{t("updateStudentCourseModal.testResult")}</label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        autoComplete="off"
                        min={0}
                        max={100}
                        name="testResult"
                        className="w-100"
                        value={formData.testResult}
                        onChange={handleChange}
                      />
                      {errors.testResult && (
                        <span className={styles.error}>
                          {errors.testResult}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={`${styles.inputsRow}`}>
                <div className={styles.formGroup}>
                  <label>
                    {t("updateStudentCourseModal.numberOfAttempts")}
                  </label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        autoComplete="off"
                        name="numberOfAttempts"
                        min={0}
                        className="w-100"
                        value={formData.numberOfAttempts}
                        onChange={handleChange}
                      />
                      {errors.numberOfAttempts && (
                        <span className={styles.error}>
                          {errors.numberOfAttempts}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className={`${styles.formGroup}`}>
                  <label>
                    {t("updateStudentCourseModal.numberOfAttemptsOnTests")}
                  </label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        autoComplete="off"
                        min={0}
                        name="numberOfAttemptsOnTests"
                        className="w-100"
                        value={formData.numberOfAttemptsOnTests}
                        onChange={handleChange}
                      />
                      {errors.numberOfAttemptsOnTests && (
                        <span className={styles.error}>
                          {errors.numberOfAttemptsOnTests}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={`${styles.inputsRow}`}>
                <div className={`${styles.formGroup}`}>
                  <label>
                    {t("updateStudentCourseModal.timeSpentTraining")}
                  </label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        name="timeSpentTraining"
                        value={formData.timeSpentTraining}
                        onChange={handleChange}
                        className="w-100"
                      />
                      {errors.timeSpentTraining && (
                        <span className={styles.error}>
                          {errors.timeSpentTraining}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className={`${styles.formGroup}`}>
                  <label>
                    {t("updateStudentCourseModal.timeSpentOnExams")}
                  </label>
                  {loading ? (
                    <Skeleton height={40} width="100%" />
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        name="timeSpentOnExams"
                        value={formData.timeSpentOnExams}
                        onChange={handleChange}
                        className="w-100"
                      />
                      {errors.timeSpentOnExams && (
                        <span className={styles.error}>
                          {errors.timeSpentOnExams}
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
                {t("addUserModal.update")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStudentCourseModal;

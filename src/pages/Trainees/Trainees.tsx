import { Table } from "@components/Table/Table";
import styles from "./Trainees.module.scss";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import type {
  Column,
  FilterField,
  MetaData,
  StudentInfo,
  StudentMain,
  StudentCourse,
} from "@utils/types";
import { useTranslation } from "react-i18next";
import { GradeBadge } from "@components/GradeBadge/GradeBadge";
import {
  GET_ALL_STUDENTS,
  GET_ALL_STUDENTS_NOT_PAGINATED,
} from "@quiries/courses/getAllTrainees";
import { formatIsoDate } from "@utils/format";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { DELETE_STUDENT } from "@mutations/students/deleteStudent";
import { toast } from "react-toastify";
import AddUserModal from "@components/AddUserModal/AddUserModal";
import { GET_ALL_ADMINS_NOT_PAGINATED } from "@quiries/admins/getAllAdmins";
import { GET_ALL_STUDENT_GROUPS } from "@quiries/groups/getAllGroups";
import UploadModal from "@components/UploadModal/UploadModal";
import { CiEdit } from "react-icons/ci";
import UpdateStudentForm from "@components/AddUserModal/UpdateStudentForm";

export default function Trainees() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const columns: Column<StudentInfo>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "totalNumberOfTraingings", header: "No. of Trainings" },
    { key: "facultyId", header: "Student Number" },
    { key: "lastTimeTraining", header: "Last Training" },
    { key: "totalNumberOfHours", header: "Total Hours" },
    {
      key: "stage",
      header: "Stage",
      render: (row) => <td>{t(`table.${row.stage}`)}</td>,
    },
    {
      key: "group",
      header: "Group",
      render: (row) => {
        // console.log("row", row);
        return <td>{row.group?.name}</td>;
      },
    },
    {
      key: "grade",
      header: "Grade",
      render: (row) => {
        return (
          <GradeBadge key={row.id} grade={row.grade} gradeKey={row.gradeKey} />
        );
      },
    },
  ];
  const exportColumns: Column<StudentInfo>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "totalNumberOfTraingings", header: "No. of Trainings" },
    { key: "facultyId", header: "Student Number" },
    { key: "lastTimeTraining", header: "Last Training" },
    { key: "totalNumberOfHours", header: "Total Hours" },
    {
      key: "stage",
      header: "Stage",
    },
    {
      key: "group",
      header: "Group",
    },
    {
      key: "grade",
      header: "Grade",
    },
    {
      key: "points",
      header: "Points",
    },
    {
      key: "badges",
      header: "Badges",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isRefetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [meta, setMeta] = useState<MetaData>({
    total: 0,
    last_page: 0,
    per_page: 0,
    current_page: 0,
    from: 0,
    to: 0,
    path: "",
  });
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    id: "",
    name: "",
    grade: "",
    stage: "",
    group: "",
  });
  const [finalFilterValues, setFinalFilterValues] = useState<
    Record<string, string>
  >({
    id: "",
    name: "",
    grade: "",
    stage: "",
    group: "",
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data, loading, refetch } = useQuery(GET_ALL_STUDENTS, {
    variables: {
      page: currentPage,
      perPage: 10,
      sortBy,
      filters: finalFilterValues,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: groups } = useQuery(GET_ALL_STUDENT_GROUPS, {
    fetchPolicy: "network-only",
  });
  const groupsOptions = groups?.getAllStudentGroups?.data.map(
    (group: { name: string; id: string }) => ({
      label: group.name,
      value: group.id,
    })
  );
  const { data: admins } = useQuery(GET_ALL_ADMINS_NOT_PAGINATED, {
    fetchPolicy: "network-only",
  });
  const adminsOptions = admins?.getAllAdminsNotPaginated?.data.map(
    (admin: { name: string; id: string }) => ({
      label: admin.name,
      value: admin.id,
    })
  );
  const [fetchExportData] = useLazyQuery(GET_ALL_STUDENTS_NOT_PAGINATED, {
    fetchPolicy: "network-only",
  });
  const filters: FilterField[] = [
    { name: "id", label: "ID", type: "text" },
    { name: "name", label: "Name", type: "text" },
    {
      name: "grade",
      label: "Grade",
      type: "select",
      options: [
        { label: "all", value: "all" },
        { label: "failed", value: "failed" },
        { label: "passed", value: "pass" },
        { label: "good", value: "good" },
        { label: "excellent", value: "excellent" },
        { label: "very_good", value: "very_good" },
      ],
    },
    {
      name: "stage",
      label: "Phase",
      type: "select",
      options: [
        { label: "all", value: "all" },
        { label: "Phase 1", value: "stage_1" },
        { label: "Phase 2", value: "stage_2" },
      ],
    },
    {
      name: "group",
      label: "Group",
      type: "select",
      options: groupsOptions,
      translate: false,
    },
  ];

  //   const nameKey = i18n.language === "ar" ? "arabicName" : "englishName";
  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "No. of Trainings", value: "totalNumberOfTraingings" },
    {
      label: "Last Training",
      value: "lastAttempt",
    },
    { label: "Total Hours", value: "totalNumberOfHours" },
    { label: "Grade", value: "grade" },
  ];
  const actions = [
    {
      renderIf: () => true,

      label: "view",
      onClick: (row: StudentInfo) => {
        navigate(`/trainees/${row.id}`);
      },
      icon: <FaEye />,
    },
    {
      renderIf: () => true,

      label: "edit",
      onClick: (row: StudentInfo) => {
        setSelectedStudent(row);
        console.log("row", row);
        setShowEditModal(true);
      },
      icon: <CiEdit />,
    },
    {
      renderIf: () => true,

      label: "delete",
      onClick: (row: StudentInfo) => {
        setSelectedStudent(row);
        setShowConfirm(true);
      },
      icon: <AiOutlineDelete />,
    },
  ];
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted: () => {
      refetch({
        page: currentPage,
        perPage: meta.per_page || 10,
        sortBy,
        filters: filterValues,
      });
      setShowConfirm(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      console.error("Delete error", error);

      setShowConfirm(false);
      toast.error(t("table.Something went wrong"), {
        theme: "colored",
        autoClose: 100000,
        pauseOnHover: true,
        draggable: true,
        rtl: i18n.dir() === "rtl",
      });
    },
  });
  useEffect(() => {
    if (!data?.getAllStudentsPaginated?.data) return;

    const transformed: StudentInfo[] = data.getAllStudentsPaginated.data.map(
      (student: StudentMain) => {
        const totalNumberOfTraingings = student.courses.reduce(
          (sum: number, course: StudentCourse) => sum + course.numberOfAttempts,
          0
        );

        const totalNumberOfHours = (
          student.courses.reduce(
            (sum: number, course: StudentCourse) =>
              sum + course.timeSpentTraining,
            0
          ) / 3600
        ).toFixed(2);

        const percentage = student.courses.length
          ? student.courses.reduce(
              (sum: number, course: StudentCourse) => sum + course.testResult,
              0
            ) / student.courses.length
          : 0;

        const gradeKey =
          percentage >= 90
            ? "excellent"
            : percentage >= 80
            ? "very_good"
            : percentage >= 70
            ? "good"
            : percentage >= 50
            ? "passed"
            : "failed";

        const grade = t(`table.${gradeKey}`);

        // const image = "image";

        return {
          id: student.id,
          //   image,
          name: student.name,
          facultyId: student.facultyId,
          stage: student.stage,
          lastTimeTraining: student.lastAttempt
            ? formatIsoDate(
                student.lastAttempt,
                i18n.language
              ) /*new Date(student.lastAttempt).toLocaleString()*/
            : t("table.no_attempt"),
          phone: student.phone,
          adminId: student.adminId,
          groupId: student.groupId,
          totalNumberOfTraingings,
          totalNumberOfHours,
          grade,
          gradeKey,
          points: student.points,
          badges: student.badges,
          group: student.group,
        };
      }
    );

    const metaData = data.getAllStudentsPaginated;
    setStudents(transformed);
    setMeta((prev) => ({
      ...prev,
      total: metaData.total,
      last_page: metaData.last_page,
      per_page: metaData.per_page,
      current_page: metaData.current_page,
      from: (metaData.current_page - 1) * metaData.per_page + 1,
      to: (metaData.current_page - 1) * metaData.per_page + transformed.length,
    }));
  }, [data, i18n.language, t]);

  // useEffect(() => {
  //   console.log("students", students);
  // }, [students]);

  // useEffect(() => {
  //   console.log("Filter values:", filterValues);
  // }, [filterValues]);
  // useEffect(() => {
  //   console.log("loading:", loading);
  // }, [loading]);
  const handleApply = async () => {
    // console.log("Apply filters:", filterValues);
    setCurrentPage(1);
    setFinalFilterValues(filterValues);
  };

  const handleReset = async () => {
    const resetFilters = {
      id: "",
      name: "",
      grade: "",
      stage: "",
      group: "",
    };
    setCurrentPage(1);
    setFilterValues(resetFilters);
    setFinalFilterValues(resetFilters);
  };

  return (
    <div className={styles.dataWrapper}>
      <Table<StudentInfo>
        data={students}
        columns={columns}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        loading={loading || isRefetching}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        onApply={handleApply}
        onReset={handleReset}
        onSortChange={setSortBy}
        sort={true}
        sortOptions={sortOptions}
        actions={actions}
        title="Students"
        addButton={true}
        onAdd={() => setShowModal(true)}
        uploadEnabled={true}
        onUpload={() => setShowUploadModal(true)}
        exportEnabled={true}
        onExport={async () => {
          try {
            const { data } = await fetchExportData({
              variables: {
                filters: filterValues,
                sortBy,
              },
            });

            const students = data?.getAllStudentsNotPaginated?.data ?? [];

            const transformed: StudentInfo[] = students.map(
              (student: StudentMain) => {
                const totalNumberOfTraingings = student.courses.reduce(
                  (sum: number, course: StudentCourse) =>
                    sum + course.numberOfAttempts,
                  0
                );

                const totalNumberOfHours = (
                  student.courses.reduce(
                    (sum: number, course: StudentCourse) =>
                      sum + course.timeSpentTraining,
                    0
                  ) / 3600
                ).toFixed(2);

                const percentage = student.courses.length
                  ? student.courses.reduce(
                      (sum: number, course: StudentCourse) =>
                        sum + course.testResult,
                      0
                    ) / student.courses.length
                  : 0;

                const gradeKey =
                  percentage >= 90
                    ? "excellent"
                    : percentage >= 80
                    ? "very_good"
                    : percentage >= 70
                    ? "good"
                    : percentage >= 50
                    ? "passed"
                    : "failed";

                const grade = t(`table.${gradeKey}`);

                return {
                  id: student.id,
                  name: student.name,
                  facultyId: student.facultyId,
                  lastTimeTraining: student.lastAttempt
                    ? formatIsoDate(student.lastAttempt, i18n.language)
                    : t("table.no_attempt"),
                  phone: student.phone,
                  stage: t(`table.${student.stage}`),
                  totalNumberOfTraingings,
                  totalNumberOfHours,
                  grade,
                  gradeKey,
                  points: student.points,
                  badges: student.badges,
                  group: student.group?.name || "",
                };
              }
            );
            // console.log("transformed", transformed);
            return transformed;
          } catch (error) {
            console.error("Export failed:", error);
            return []; // return empty array on error
          }
        }}
        exportColumns={exportColumns}
        exportFileName="students"
      />
      {showConfirm && selectedStudent && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>
              {t("table.deleteModal")} <strong>{selectedStudent.name}</strong> ?
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmDelete}
                onClick={() =>
                  deleteStudent({ variables: { id: selectedStudent.id } })
                }
              >
                {t("table.confirm")}
              </button>
              <button
                className={styles.confirmCancel}
                onClick={() => setShowConfirm(false)}
              >
                {t("table.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          userTypeProp="trainee"
          refetch={refetch}
          adminsOptions={adminsOptions}
          groupsOptions={groupsOptions}
        />
      )}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          refetch={refetch}
        />
      )}
      {showEditModal && selectedStudent && (
        <UpdateStudentForm
          onClose={() => setShowEditModal(false)}
          refetch={refetch}
          adminsOptions={adminsOptions}
          groupsOptions={groupsOptions}
          student={selectedStudent}
          userType="trainee"
        />
      )}
    </div>
  );
}

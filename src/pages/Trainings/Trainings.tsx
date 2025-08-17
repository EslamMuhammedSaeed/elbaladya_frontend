import { Table } from "@components/Table/Table";
import styles from "./Trainings.module.scss";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COURSES } from "@quiries/courses/getAllCourses";
import type {
  Column,
  FilterField,
  MetaData,
  TrainingInfo,
  Course,
  Student,
} from "@utils/types";
import { useTranslation } from "react-i18next";
import { GradeBadge } from "@components/GradeBadge/GradeBadge";

const columns: Column<TrainingInfo>[] = [
  { key: "name", header: "Name" },
  { key: "entranceCount", header: "Entrance Count" },
  { key: "numberOfTrainees", header: "Trainees" },
  { key: "numberOfPassedTrainees", header: "Passed" },
  { key: "precentage", header: "Percentage" },
  { key: "totalSpendedHours", header: "Hours" },
  // { key: "grade", header: "Grade" },
  {
    key: "grade",
    header: "Grade",
    render: (row) => {
      return <GradeBadge grade={row.grade} gradeKey={row.gradeKey} />;
    },
  },
];

export default function Trainings() {
  const { t, i18n } = useTranslation();
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [trainings, setTrainings] = useState<TrainingInfo[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [meta, setMeta] = useState<MetaData>({
    total: 0,
    last_page: 0,
    per_page: 0,
    current_page: 0,
    from: 0,
    to: 0,
    path: "",
  });

  const filters: FilterField[] = [];

  const { data, loading, refetch } = useQuery(GET_ALL_COURSES, {
    variables: {
      page: currentPage,
      perPage: 10,
      sortBy,
    },
    fetchPolicy: "cache-and-network",
  });
  const nameKey = i18n.language === "ar" ? "arabicName" : "englishName";
  const sortOptions = [
    { label: "Name", value: nameKey },
    { label: "Entrance Count", value: "entranceCount" },
    { label: "Trainees", value: "numberOfTrainees" },
    {
      label: "Passed",
      value: "numberOfPassedTrainees",
    },
    { label: "Percentage", value: "precentage" },
    { label: "Hours", value: "totalSpendedHours" },
    { label: "Grade", value: "grade" },
  ];
  useEffect(() => {
    if (!data?.getAllCoursesPaginated?.data) return;

    const transformed: TrainingInfo[] = data.getAllCoursesPaginated.data.map(
      (course: Course) => {
        const entranceCount = course.students.reduce(
          (sum: number, student: Student) =>
            sum + student.numberOfAttempts + student.numberOfAttemptsOnTests,
          0
        );

        const totalSpendedHours = (
          course.students.reduce(
            (sum: number, student: Student) =>
              sum + student.timeSpentOnExams + student.timeSpentTraining,
            0
          ) / 3600
        ).toFixed(2);

        const numberOfTrainees = course.students.length;

        const numberOfPassedTrainees = course.students.filter(
          (student: Student) =>
            student.testResult > 0 || student.trainingResult > 0
        ).length;

        const precentage = course.students.length
          ? course.students.reduce((sum: number, student: Student) => {
              const testResult = student.testResult || 0;
              const trainingResult = student.trainingResult || 0;

              return (
                sum +
                (testResult > 0 && trainingResult > 0
                  ? (testResult + trainingResult) / 2
                  : testResult || trainingResult)
              );
            }, 0) / course.students.length
          : 0;

        const gradeKey =
          precentage >= 90
            ? "excellent"
            : precentage >= 80
            ? "very_good"
            : precentage >= 70
            ? "good"
            : precentage >= 50
            ? "passed"
            : "failed";

        const grade = t(`table.${gradeKey}`);

        const image = "image";

        return {
          id: course.id,
          name: i18n.language === "ar" ? course.arabicName : course.englishName,
          entranceCount: entranceCount.toString(),
          numberOfTrainees: numberOfTrainees.toString(),
          numberOfPassedTrainees: numberOfPassedTrainees.toString(),
          precentage: precentage.toFixed(2),
          totalSpendedHours,
          grade,
          gradeKey,
          image,
        };
      }
    );

    const metaData = data.getAllCoursesPaginated;
    setTrainings(transformed);
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
  useEffect(() => {
    refetch({ page: currentPage, perPage: meta.per_page || 10, sortBy });
  }, [sortBy]);
  const handleApply = () => {
    console.log("Apply filters:", filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
  };

  return (
    <div className={styles.dataWrapper}>
      <Table<TrainingInfo>
        data={trainings}
        columns={columns}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        loading={loading}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        onApply={handleApply}
        onReset={handleReset}
        onSortChange={setSortBy}
        sort={true}
        sortOptions={sortOptions}
        actions={[]}
        title="trainings"
      />
    </div>
  );
}

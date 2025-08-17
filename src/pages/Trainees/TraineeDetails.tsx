import { useQuery } from "@apollo/client";
import { GET_STUDENT_BY_ID } from "@quiries/students/getStudentById";
import { useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./TraineeDetails.module.scss";

import {
  FaGraduationCap,
  FaClock,
  FaPlay,
  FaChartLine,
  FaIdCard,
  FaPhone,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { formatIsoDate } from "@utils/format";
import { useTranslation } from "react-i18next";
import type { StudentCourse } from "@utils/types";
import ActionsDropdown from "@components/ActionsDropdown/ActionsDropdown";
import UpdateStudentCourseModal from "@components/AddUserModal/UpdateStudentCourseModal";

export default function TraineeDetails() {
  const { id } = useParams<{ id: string }>();
  const { i18n, t } = useTranslation();
  const [showUpdateStudentCourseModal, setShowUpdateStudentCourseModal] =
    useState(false);
  const [selectedStudentCourse, setSelectedStudentCourse] =
    useState<StudentCourse | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_STUDENT_BY_ID, {
    variables: { id: id },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  const totalNumberOfTrainings = data?.getStudentById.courses?.length;
  const totalNumberOfCompletedTrainings = data?.getStudentById.courses.filter(
    (course: StudentCourse) => {
      return course.progress === 1;
    }
  ).length;

  const totalTimeSpentTraining = data?.getStudentById.courses?.reduce(
    (sum: number, course: StudentCourse) => sum + course.timeSpentTraining,
    0
  );

  const totalProgress =
    data?.getStudentById.courses?.length > 0
      ? (
          (data?.getStudentById.courses?.reduce(
            (sum: number, course: StudentCourse) =>
              sum + (course.progress ?? 0),
            0
          ) /
            data?.getStudentById.courses?.length) *
          100
        ).toFixed(2)
      : "0";

  const percentageColor = (progress: number) => {
    if (progress < 50) return "#f44336";
    if (progress < 75) return "#ff9800";
    if (progress < 90) return "#2196f3";
    return "#4caf50";
  };

  // Sorting functions
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedCourses = () => {
    if (!data?.getStudentById.courses) return [];

    const courses = [...data.getStudentById.courses];

    if (!sortConfig) return courses;

    return courses.sort((a: StudentCourse, b: StudentCourse) => {
      let aValue: string | number, bValue: string | number;

      switch (sortConfig.key) {
        case "name":
          aValue =
            i18n.language === "ar"
              ? a.course?.arabicName || ""
              : a.course?.englishName || "";
          bValue =
            i18n.language === "ar"
              ? b.course?.arabicName || ""
              : b.course?.englishName || "";
          break;
        case "attempts":
          aValue = a.numberOfAttempts || 0;
          bValue = b.numberOfAttempts || 0;
          break;
        case "percentage":
          aValue = a.trainingResult || 0;
          bValue = b.trainingResult || 0;
          break;
        case "progress":
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Dummy data for the dashboard
  const dummyData = {
    stats: [
      {
        title: t("traineeDetails.completedCourses"),
        value: totalNumberOfCompletedTrainings,
        // percentage: "+15%",
        icon: <FaGraduationCap />,
        color: "#ff6b6b",
      },
      {
        title: t("traineeDetails.totalTrainingHours"),
        value: (totalTimeSpentTraining / 60 / 60).toFixed(2),
        // percentage: "+15%",
        icon: <FaClock />,
        color: "#ffa726",
      },
      {
        title: t("traineeDetails.enabledCourses"),
        value: totalNumberOfTrainings,
        // percentage: "+15%",
        icon: <FaPlay />,
        color: "#26a69a",
      },
      {
        title: t("traineeDetails.skipPercentage"),
        value: totalProgress ? totalProgress + " %" : "0 %",
        // percentage: "+15%",
        icon: <FaChartLine />,
        color: "#42a5f5",
      },
    ],
  };

  if (!id) return <p>Invalid student ID</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getStudentById) return <p>Student not found.</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        {/* User Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <h2 className={styles.profileName}>{data.getStudentById.name}</h2>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.profileItem}>
              <div className={styles.profileIcon}>
                <FaIdCard />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileLabel}>
                  {t("traineeDetails.facultyId")}
                </span>
                <span className={styles.profileValue}>
                  {data.getStudentById.facultyId}
                </span>
              </div>
            </div>

            <div className={styles.profileItem}>
              <div className={styles.profileIcon}>
                <FaPhone />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileLabel}>
                  {t("traineeDetails.phone")}
                </span>
                <span className={styles.profileValue}>
                  {data.getStudentById.phone}
                </span>
              </div>
            </div>
            {data.getStudentById.lastAttempt && (
              <div className={styles.profileItem}>
                <div className={styles.profileIcon}>
                  <FaClock />
                </div>

                <div className={styles.profileInfo}>
                  <span className={styles.profileLabel}>
                    {t("traineeDetails.lastTraining")}
                  </span>
                  <span className={styles.profileValue}>
                    {formatIsoDate(
                      data.getStudentById.lastAttempt,
                      i18n.language
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className={styles.statsGrid}>
          {dummyData.stats.map((stat, index) => (
            <div
              key={index}
              className={styles.statCard}
              style={{ borderLeftColor: stat.color }}
            >
              <div className={styles.statIcon} style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statTitle}>{stat.title}</h3>
                <div className={styles.statValue}>
                  <span className={styles.value}>{stat.value}</span>
                  {/* {stat.percentage && (
                    <span className={styles.percentage}>{stat.percentage}</span>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {/* <div className={styles.mainContent}> */}
      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* Performance in Experiments */}
        <div className={styles.experimentsSection}>
          <h3 className={styles.sectionTitle}>
            {t("traineeDetails.performanceInExperiments")}
          </h3>
          <div className={styles.experimentsTable}>
            <div className={styles.tableHeader}>
              <span
                className={styles.sortableHeader}
                onClick={() => handleSort("name")}
              >
                {t("traineeDetails.experimentName")} {getSortIcon("name")}
              </span>
              <span
                className={`${styles.sortableHeader} text-center`}
                onClick={() => handleSort("attempts")}
              >
                {t("traineeDetails.numberOfAttempts")} {getSortIcon("attempts")}
              </span>
              <span
                className={styles.sortableHeader}
                onClick={() => handleSort("percentage")}
              >
                {/* {t("traineeDetails.percentage")} {getSortIcon("percentage")} */}
                {t("traineeDetails.testResult")} {getSortIcon("percentage")}
              </span>
              <span
                className={styles.sortableHeader}
                onClick={() => handleSort("progress")}
              >
                {t("traineeDetails.progress")} {getSortIcon("progress")}
              </span>
              <span className="text-center">{t("traineeDetails.actions")}</span>
            </div>
            {getSortedCourses().map((course: StudentCourse, index: number) => (
              <div key={index} className={styles.tableRow}>
                <span className={styles.experimentName}>
                  {i18n.language === "ar"
                    ? course.course?.arabicName
                    : course.course?.englishName}
                </span>
                <span className={styles.experimentTimes}>
                  {course.numberOfAttempts}
                </span>

                {/* <div className={styles.percentageBar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${course.progress ? course.progress * 100 : 0}%`,
                      backgroundColor: percentageColor(
                        course.progress ? course.progress * 100 : 0
                      ),
                    }}
                  ></div>
                  <span className={styles.percentageText}>
                    {course.progress ? course.progress * 100 : 0}%
                  </span>
                </div> */}
                <div className={styles.percentageBar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${course.testResult ? course.testResult : 0}%`,
                      backgroundColor: percentageColor(
                        course.testResult ? course.testResult : 0
                      ),
                    }}
                  ></div>
                  <span className={styles.percentageText}>
                    {course.testResult ? course.testResult : 0}%
                  </span>
                </div>
                <div className={styles.percentageBar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${course.progress ? course.progress * 100 : 0}%`,
                      backgroundColor: percentageColor(
                        course.progress ? course.progress * 100 : 0
                      ),
                    }}
                  ></div>
                  <span className={styles.percentageText}>
                    {course.progress ? course.progress * 100 : 0}%
                  </span>
                </div>
                <div className={styles.actions}>
                  <ActionsDropdown
                    actions={[
                      {
                        renderIf: () => true,
                        label: "edit",
                        onClick: () => {
                          setSelectedStudentCourse(course);
                          setShowUpdateStudentCourseModal(true);
                        },
                        icon: <FaEdit />,
                      },
                    ]}
                    row={course}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Charts */}
        {/* <div className={styles.chartsSection}> */}
        {/* Training Entry Count */}
        {/* <div className={styles.pieChartSection}>
            <h3 className={styles.sectionTitle}>
              عدد مرات الدخول الى كل التدريبات
            </h3>
            <div className={styles.pieChartContainer}>
              <div className={styles.pieLegend}>
                {dummyData.trainingEntries.breakdown.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={styles.legendLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.pieChart}>
                <div className={styles.pieCenter}>
                  <span className={styles.pieTotal}>
                    {dummyData.trainingEntries.total}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
        {/* Time Spent on Training */}
        {/* <div className={styles.timeSection}>
            <h3 className={styles.sectionTitle}>الوقت المستغرق للتدريب</h3>
            <div className={styles.timeDisplay}>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>
                  {dummyData.timeSpent.hours}
                </span>
                <span className={styles.timeLabel}>ساعة</span>
              </div>
              <span className={styles.timeSeparator}>:</span>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>
                  {dummyData.timeSpent.minutes}
                </span>
                <span className={styles.timeLabel}>دقيقة</span>
              </div>
              <span className={styles.timeSeparator}>:</span>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>
                  {dummyData.timeSpent.seconds}
                </span>
                <span className={styles.timeLabel}>ثانية</span>
              </div>
            </div>
          </div> */}
        {/* </div> */}
        {/* </div> */}
      </div>
      {showUpdateStudentCourseModal && (
        <UpdateStudentCourseModal
          onClose={() => {
            setShowUpdateStudentCourseModal(false);
          }}
          refetch={refetch}
          studentCourse={selectedStudentCourse}
        />
      )}
    </div>
  );
}

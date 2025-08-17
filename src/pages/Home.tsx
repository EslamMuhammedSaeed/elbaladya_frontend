import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  IoDocumentText,
  IoTime,
  IoPeople,
  IoPersonAdd,
  IoFlame,
  IoConstruct,
  IoWarning,
  IoLayers,
  IoChevronUp,
  IoChevronDown,
} from "react-icons/io5";
import styles from "./Home.module.scss";
import type { ChartTypeRegistry, TooltipItem } from "chart.js";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "@quiries/dashboard/getDashboardData";
import { useTranslation } from "react-i18next";
import Skeleton from "@components/Skeleton/Skeleton";
import { useState, useMemo } from "react";
import { useDarkMode } from "@context/DarkModeContext";

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "chart.js" {
  interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
    centerText?: {
      text: string;
    };
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  {
    id: "centerText",
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      const text = chart.options.plugins?.centerText?.text ?? "";

      // Use the chart's actual drawing area center
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.font = "bold 24px Alexandria";
      ctx.fillStyle = document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    },
  }
);

// Types for sorting
type SortField =
  | "arabicName"
  | "englishName"
  | "totalTimeSpentTraining"
  | "totalNumberOfAttempts"
  | "studentCount"
  | "averageTrainingResultPercentage";
type SortDirection = "asc" | "desc";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("arabicName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { isDark } = useDarkMode();
  const percentageColor = (progress: number) => {
    if (progress < 50) return "#ff6b6b";
    if (progress < 75) return "#ffa500";
    if (progress < 90) return "#265bc1";
    return "#39af8b";
  };

  // Sort courses data
  const sortedCourses = useMemo(() => {
    if (!data?.getDashboardData?.courses) return [];

    return [...data.getDashboardData.courses].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.getDashboardData?.courses, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <IoChevronUp style={{ opacity: 0.3 }} />;
    }
    return sortDirection === "asc" ? <IoChevronUp /> : <IoChevronDown />;
  };

  const dashboardData = {
    metrics: [
      {
        title: t("dashboard.completedCourses"),
        value: data?.getDashboardData?.completedCoursesCount || 0,
        percentage:
          data?.getDashboardData?.completedCoursesPercentage?.toFixed(2) +
            "%" || "0%",
        icon: <IoDocumentText />,
        color: "#ff6b6b",
      },
      {
        title: t("dashboard.totalTrainingHours"),
        value: data?.getDashboardData?.totalTimeSpentTraining || 0,
        icon: <IoTime />,
        color: "#ffa726",
      },
      {
        title: t("dashboard.traineesStartedTraining"),
        value: data?.getDashboardData?.studentsWithProgressCount || 0,
        percentage:
          data?.getDashboardData?.studentsWithProgressPercentage?.toFixed(2) +
            "%" || "0%",
        icon: <IoPeople />,
        color: "#26a69a",
      },
      {
        title: t("dashboard.registeredTrainees"),
        value: data?.getDashboardData?.totalStudents || 0,
        icon: <IoPersonAdd />,
        color: "#42a5f5",
      },
    ],
    performanceData: [
      { name: "مكافحة الحريق", percentage: 87, trainees: 2, color: "#39af8b" },
      {
        name: "أسطح العمل والسير",
        percentage: 70,
        trainees: 4,
        color: "#265bc1",
      },
      { name: "المسالخ", percentage: 88, trainees: 2, color: "#39af8b" },
      { name: "أعمال الحفر", percentage: 72, trainees: 1, color: "#ffa500" },
      { name: "الشواطئ الآمنة", percentage: 80, trainees: 5, color: "#265bc1" },
      {
        name: "السقالات ومنصات العمل",
        percentage: 43,
        trainees: 2,
        color: "#ff6b6b",
      },
      {
        name: "منصات التحميل غير الآمنة",
        percentage: 77,
        trainees: 6,
        color: "#265bc1",
      },
      { name: "مكافحة الحريق", percentage: 30, trainees: 7, color: "#ff6b6b" },
      {
        name: "مخاطر الشاحنات والمعدات الثقيلة",
        percentage: 90,
        trainees: 3,
        color: "#ffa500",
      },
    ],
    // passRateData: {
    //   labels: ["مقبول", "جيد", "جيد جدا", "ممتاز"],
    //   datasets: [
    //     {
    //       data: [25, 33, 42, 10],
    //       backgroundColor: [
    //         "#ff6b6b",
    //         "#ffa500",
    //         "rgba(55, 182, 254, 1)",
    //         "rgba(77, 176, 159, 1)",
    //       ],
    //       borderWidth: 0,
    //     },
    //   ],
    // },
    passRateData: {
      labels: [
        t("dashboard.failed"),
        t("dashboard.passed"),
        t("dashboard.good"),
        t("dashboard.veryGood"),
        t("dashboard.excellent"),
      ],
      datasets: [
        {
          data: [
            data?.getDashboardData?.trainingResultCategories
              ?.find(
                (category: { label: string; percentage: number }) =>
                  category.label === "failed"
              )
              ?.percentage.toFixed(2) || 0,
            data?.getDashboardData?.trainingResultCategories
              ?.find(
                (category: { label: string; percentage: number }) =>
                  category.label === "passed"
              )
              ?.percentage.toFixed(2) || 0,
            data?.getDashboardData?.trainingResultCategories
              ?.find(
                (category: { label: string; percentage: number }) =>
                  category.label === "good"
              )
              ?.percentage.toFixed(2) || 0,
            data?.getDashboardData?.trainingResultCategories
              ?.find(
                (category: { label: string; percentage: number }) =>
                  category.label === "veryGood"
              )
              ?.percentage.toFixed(2) || 0,
            data?.getDashboardData?.trainingResultCategories
              ?.find(
                (category: { label: string; percentage: number }) =>
                  category.label === "excellent"
              )
              ?.percentage.toFixed(2) || 0,
          ],
          backgroundColor: [
            "#ff6b6b", // Failed
            "#d0cfcf", // Passed
            "#ffa500", // Good
            "rgba(55, 182, 254, 1)", // Very Good
            "rgba(77, 176, 159, 1)", // Excellent
          ],
          borderWidth: 0,
        },
      ],
    },
    trainingHoursData: {
      labels: ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"],
      datasets: [
        {
          label: "ساعات التدريب الحالية",
          data: [12, 15, 17, 14],
          borderColor: "#39af8b",
          backgroundColor: "rgba(57, 175, 139, 0.1)",
          tension: 0.4,
        },
        {
          label: "ساعات التدريب السابقة",
          data: [8, 10, 12, 9],
          borderColor: "#265bc1",
          backgroundColor: "rgba(38, 91, 193, 0.1)",
          tension: 0.4,
        },
      ],
    },
    courseDetails: [
      { hours: "00:12", entries: 7, name: "مكافحة الحريق", icon: <IoFlame /> },
      {
        hours: "00:15",
        entries: 5,
        name: "مكافحة الحريق باستخدام الطفاية الحقيقية",
        icon: <IoFlame />,
      },
      {
        hours: "00:17",
        entries: 8,
        name: "أسطح العمل والسير",
        icon: <IoConstruct />,
      },
      {
        hours: "00:13",
        entries: 3,
        name: "السقالات ومنصات العمل",
        icon: <IoLayers />,
      },
      {
        hours: "00:17",
        entries: 1,
        name: "العمل في المرتفعات غير الآمنة",
        icon: <IoWarning />,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    borderRadius: 3,
    offset: 8,
    cutout: "60%",
    plugins: {
      legend: {
        position: "left" as const,
        labels: {
          font: {
            family: "Alexandria",
            size: 12,
          },
          color: isDark ? "#ffffff" : "#333333",
        },
      },
      centerText: {
        text: data?.getDashboardData?.courses?.length || 0,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            // const label = context.label || "";
            const value = context.raw;
            return `${value}%`;
          },
        },
      },
    },
  };

  // Skeleton components
  const MetricCardSkeleton = () => (
    <div className={styles.statCard}>
      <Skeleton width={60} height={60} borderRadius={12} />
      <div className={styles.statContent}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={24} />
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className={styles.tableSection}>
      <Skeleton width="200px" height={24} style={{ marginBottom: 20 }} />
      <div className={styles.tableContainer}>
        <table className={styles.courseTable}>
          <thead>
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i}>
                  <Skeleton width="100px" height={16} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5].map((cell) => (
                  <td key={cell}>
                    <Skeleton width="80%" height={16} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className={styles.section}>
      <Skeleton width="200px" height={24} style={{ marginBottom: 20 }} />
      <Skeleton width="100%" height={250} borderRadius={8} />
    </div>
  );

  if (loading) {
    return (
      <div className={styles.dashboard}>
        {/* Metrics Grid Skeleton */}
        <div className={styles.metricsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className={styles.mainGrid}>
          <TableSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorMessage}>
          <h2>Error loading dashboard data</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Top Metrics Cards */}
      <div className={styles.metricsGrid}>
        {dashboardData.metrics.map((metric, index) => (
          <div
            key={index}
            className={styles.statCard}
            style={{ borderLeftColor: metric.color }}
          >
            <div className={styles.statIcon} style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>{metric.title}</h3>
              <div className={styles.statValue}>
                <span className={styles.value}>{metric.value}</span>
                {metric.percentage && (
                  <span className={styles.percentage}>{metric.percentage}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Course Details Table */}
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>
            {t("dashboard.courseDetails")}
          </h2>
          <div className={styles.tableContainer}>
            <table className={styles.courseTable}>
              <thead>
                <tr>
                  <th
                    className={styles.sortableHeader}
                    onClick={() =>
                      handleSort(
                        i18n.language === "ar" ? "arabicName" : "englishName"
                      )
                    }
                  >
                    <div className={styles.headerContent}>
                      {t("dashboard.courseName")}
                      {renderSortIcon(
                        i18n.language === "ar" ? "arabicName" : "englishName"
                      )}
                    </div>
                  </th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("totalTimeSpentTraining")}
                  >
                    <div className={styles.headerContent}>
                      {t("dashboard.totalTrainingHours")}
                      {renderSortIcon("totalTimeSpentTraining")}
                    </div>
                  </th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("totalNumberOfAttempts")}
                  >
                    <div className={styles.headerContent}>
                      {t("dashboard.entries")}
                      {renderSortIcon("totalNumberOfAttempts")}
                    </div>
                  </th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("studentCount")}
                  >
                    <div className={styles.headerContent}>
                      {t("dashboard.studentCount")}
                      {renderSortIcon("studentCount")}
                    </div>
                  </th>
                  <th
                    className={`${styles.sortableHeader} ${styles.performancePercentageHeader}`}
                    onClick={() =>
                      handleSort("averageTrainingResultPercentage")
                    }
                  >
                    <div className={styles.headerContent}>
                      {t("dashboard.performancePercentage")}
                      {renderSortIcon("averageTrainingResultPercentage")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map(
                  (
                    course: {
                      arabicName: string;
                      englishName: string;
                      entries: number;
                      totalTimeSpentTraining: number;
                      totalNumberOfAttempts: number;
                      studentCount: number;
                      averageTrainingResultPercentage: number;
                    },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td>
                        {i18n.language === "ar"
                          ? course.arabicName
                          : course.englishName}
                      </td>
                      <td>{course.totalTimeSpentTraining}</td>
                      <td>
                        <div className={styles.courseName}>
                          {course.totalNumberOfAttempts}
                        </div>
                      </td>
                      <td>{course.studentCount}</td>
                      <td>
                        {course.averageTrainingResultPercentage.toFixed(2)}%
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${course.averageTrainingResultPercentage.toFixed(
                                2
                              )}%`,
                              backgroundColor: percentageColor(
                                course.averageTrainingResultPercentage
                              ),
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Pass Rate */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t("dashboard.trainingPassRate")}
          </h2>
          <div className={styles.passRateContainer}>
            <div className={styles.doughnutChart}>
              <Doughnut
                data={dashboardData.passRateData}
                options={doughnutOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

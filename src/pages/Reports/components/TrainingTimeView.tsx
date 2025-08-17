import React from "react";
import { useTranslation } from "react-i18next";

import { Bar } from "react-chartjs-2";
import styles from "../Reports.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { GET_TRAINING_TIME_DATA } from "@quiries/reports/getReportsData";
import { useQuery } from "@apollo/client";
import Skeleton from "@components/Skeleton/Skeleton";

// Register chart components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrainingTimeView: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { t, i18n } = useTranslation();
  const { data, loading } = useQuery(GET_TRAINING_TIME_DATA, {
    fetchPolicy: "network-only",

    variables: {
      groupId: groupId || null,
    },
  });

  // console.log(
  //   data?.getStudentCoursesTimeSpentTrainingData?.topCourses?.map(
  //     (course: { arabicName: string; englishName: string }) =>
  //       i18n.language === "ar" ? course.arabicName : course.englishName
  //   )
  // );

  // Skeleton components
  const ChartSkeleton = () => (
    <div className={styles.chartSection}>
      <Skeleton width="200px" height={24} style={{ marginBottom: 20 }} />
      <Skeleton width="100%" height={250} borderRadius={8} />
    </div>
  );

  const chartData = {
    labels: data?.getStudentCoursesTimeSpentTrainingData?.topCourses?.map(
      (course: { arabicName: string; englishName: string }) =>
        i18n.language === "ar" ? course.arabicName : course.englishName
    ),
    datasets: [
      {
        label: t("reports.trainingHours"),
        data: data?.getStudentCoursesTimeSpentTrainingData?.topCourses?.map(
          (course: { timeSpentTraining: number }) => course.timeSpentTraining
        ),
        backgroundColor: [
          "#2196f3",
          "#26a69a",
          "#4caf50",
          "#ff9800",
          "#8d6e63",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: data?.getStudentCoursesTimeSpentTrainingData?.topCourses?.reduce(
          (max: number, course: { timeSpentTraining: number }) =>
            Math.max(max, course.timeSpentTraining),
          0
        ),

        ticks: {
          stepSize: (
            data?.getStudentCoursesTimeSpentTrainingData?.topCourses?.reduce(
              (max: number, course: { timeSpentTraining: number }) =>
                Math.max(max, course.timeSpentTraining),
              0
            ) / 10
          ).toFixed(0),
          callback: function (value: number | string) {
            return value + " H";
          },
        },
        title: {
          display: true,
          text: t("reports.trainingHours"),
          font: { size: 14 },
        },
      },
      x: {
        title: {
          display: true,
          text: t("reports.courseName"),
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className={`${styles.trainingTimeView} w-100`}>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className={`${styles.trainingTimeView} w-100`}>
      {/* Bar Chart */}
      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>
          {t("reports.trainingTimeChart")}
        </h2>
        <div className={`${styles.barChart} px-3`}>
          <Bar
            key={JSON.stringify(chartData)}
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingTimeView;

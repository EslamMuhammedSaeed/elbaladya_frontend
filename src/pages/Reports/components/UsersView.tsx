import React from "react";
import { useTranslation } from "react-i18next";
import { IoPeople } from "react-icons/io5";
import styles from "../Reports.module.scss";
import { useQuery } from "@apollo/client";
import { GET_USERS_DATA } from "@quiries/reports/getReportsData";
import Skeleton from "@components/Skeleton/Skeleton";

const UsersView: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_USERS_DATA, {
    fetchPolicy: "network-only",

    variables: {
      groupId: groupId || null,
    },
  });

  // useEffect(() => {
  //   console.log(groupId);
  // }, [groupId]);

  // Skeleton components
  const MetricCardSkeleton = () => (
    <div className={styles.metricCard}>
      <Skeleton width={60} height={60} borderRadius={12} />
      <div className={styles.metricContent}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={24} />
      </div>
    </div>
  );

  const metricData = [
    {
      icon: <IoPeople />,
      title: t("reports.totalUsers"),
      value: data?.getUsersData?.totalUsers,

      gradient: "linear-gradient(135deg, #ff6b6b, #ffa500)",
    },
    {
      icon: <IoPeople />,
      title: t("reports.totalAdmins"),
      value: data?.getUsersData?.totalAdmins,

      gradient: "linear-gradient(135deg, #ffa500, #ffd700)",
    },
    {
      icon: <IoPeople />,
      title: t("reports.totalStudents"),
      value: data?.getUsersData?.totalStudents,
      change:
        "+ " +
        (data?.getUsersData?.totalStudentsLastMonthIncreasePercentage.toFixed(
          2
        ) || "0.00") +
        " %",
      gradient: "linear-gradient(135deg, #39af8b, #4ade80)",
    },
    // {
    //   icon: <IoMdDoneAll />,
    //   title: t("reports.overallTrainingsCompletedPercentage"),
    //   value:
    //     (data?.getVisionData?.overallTrainingsCompletedPercentage.toFixed(2) ||
    //       "0.00") + " %",
    //   // change: "+15%",
    //   gradient: "linear-gradient(135deg, #265bc1, #3b82f6)",
    // },
  ];

  // const chartData = {
  //   labels: [
  //     t("reports.completed"),
  //     t("reports.inProgress"),
  //     t("reports.pending"),
  //   ],
  //   datasets: [
  //     {
  //       data: [54, 30, 16],
  //       backgroundColor: [
  //         "#ff9800",
  //         "#e91e63",
  //         "#9c27b0",
  //         "#2196f3",
  //         "#4caf50",
  //       ],
  //       borderWidth: 0,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   cutout: "60%",
  //   plugins: {
  //     legend: {
  //       position: "bottom" as const,
  //       labels: {
  //         font: {
  //           family: "Alexandria",
  //           size: 12,
  //         },
  //       },
  //     },
  //   },
  // };

  if (loading) {
    return (
      <div className={`${styles.insightsView} w-100`}>
        {/* Metric Cards Skeleton */}
        <div className={styles.metricGrid}>
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.insightsView} w-100`}>
      {/* Metric Cards */}
      <div className={styles.metricGrid}>
        {metricData.map((metric, index) => (
          <div
            key={index}
            className={styles.metricCard}
            style={{ background: metric.gradient }}
          >
            <div className={styles.metricIcon}>{metric.icon}</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricTitle}>{metric.title}</h3>
              <div className={styles.metricValue}>
                <span className={styles.value}>{metric.value}</span>
                <span className={styles.change}>{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doughnut Chart */}
      {/* <div className={styles.chartSection}>
        <div className={styles.doughnutChart}>
          <Doughnut data={chartData} options={chartOptions} />
          <div className={styles.chartCenter}>
            <h3>{t("reports.completed")}</h3>
            <span className={styles.chartPercentage}>54%</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UsersView;

import React from "react";
import { useTranslation } from "react-i18next";
import {
  IoDocumentText,
  IoShieldCheckmark,
  IoStar,
  IoPerson,
} from "react-icons/io5";
import styles from "../Reports.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TOP_STUDENTS_DATA } from "@quiries/reports/getReportsData";
import Skeleton from "@components/Skeleton/Skeleton";

const TopStudentsView: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { t } = useTranslation();

  const { data, loading } = useQuery(GET_TOP_STUDENTS_DATA, {
    fetchPolicy: "network-only",
    variables: {
      groupId: groupId || null,
    },
  });

  // Skeleton components
  const LeaderboardSkeleton = () => (
    <div className={styles.leaderboardSection}>
      <Skeleton width="200px" height={24} style={{ marginBottom: 20 }} />
      <div className={styles.leaderboard}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.leaderboardItem}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <div className={styles.userInfo}>
              <Skeleton width="120px" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="80px" height={14} />
            </div>
            <Skeleton width={24} height={24} borderRadius={12} />
          </div>
        ))}
      </div>
    </div>
  );

  const KpiCardSkeleton = () => (
    <div className={styles.kpiCard}>
      <Skeleton width={40} height={40} borderRadius={8} />
      <div className={styles.kpiContent}>
        <Skeleton width="60px" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="80px" height={14} />
      </div>
    </div>
  );

  // const leaderboardData = [
  //   { name: "AHMED", score: "18.74 K", rank: 1, color: "#26a69a" },
  //   { name: "MOHAMED", score: "13.74 K", rank: 2, color: "#8d6e63" },
  //   { name: "ESLAM", score: "12.74 K", rank: 3, color: "#ff9800" },
  // ];
  const colors = ["#26a69a", "#8d6e63", "#ff9800"];
  const leaderboardData = data?.getTopStudentsData?.topStudents?.map(
    (
      student: {
        name: string;
        points: string;
        badges: number;
        color: string;
        rank: number;
        certificates: number;
      },
      index: number
    ) => ({
      name: student.name,
      points: student.points,
      badges: student.badges,
      color: colors[index],
      certificates: student.certificates,
      rank: index + 1,
    })
  );

  const kpiData = [
    {
      icon: <IoDocumentText />,
      value: data?.getTopStudentsData?.topStudents?.[0]?.certificates,
      label: t("reports.certificates"),
    },
    {
      icon: <IoShieldCheckmark />,
      value: data?.getTopStudentsData?.topStudents?.[0]?.badges,
      label: t("reports.badges"),
    },
    {
      icon: <IoStar />,
      value: data?.getTopStudentsData?.topStudents?.[0]?.points,
      label: t("reports.points"),
    },
  ];

  if (loading) {
    return (
      <div className={`${styles.usersView} w-100`}>
        <LeaderboardSkeleton />
        <div className={styles.kpiSection}>
          <Skeleton width="200px" height={24} style={{ marginBottom: 20 }} />
          <div className={styles.kpiGrid}>
            {[1, 2, 3].map((i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.usersView} w-100`}>
      {/* Leaderboard */}
      <div className={styles.leaderboardSection}>
        <h2 className={styles.sectionTitle}>{t("reports.leaderboard")}</h2>
        <div className={styles.leaderboard}>
          {leaderboardData?.map(
            (user: {
              name: string;
              points: string;
              badges: number;
              color: string;
              rank: number;
            }) => (
              <div
                key={user.name}
                className={`${styles.leaderboardItem} ${
                  styles[`rank${user.rank}`]
                }`}
                style={{ "--rank-color": user.color } as React.CSSProperties}
              >
                <div className={styles.avatar}>
                  <IoPerson />
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.name}</h3>
                  <p className={styles.userScore}>{user.points}</p>
                </div>
                <div className={styles.rankBadge}>{user.rank}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiSection}>
        <h2 className={styles.sectionTitle}>{t("reports.keyMetrics")}</h2>
        <div className={styles.kpiGrid}>
          {kpiData.map((kpi, index) => (
            <div key={index} className={styles.kpiCard}>
              <div className={styles.kpiIcon}>{kpi.icon}</div>
              <div className={styles.kpiContent}>
                <h3 className={styles.kpiValue}>{kpi.value}</h3>
                <p className={styles.kpiLabel}>{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopStudentsView;

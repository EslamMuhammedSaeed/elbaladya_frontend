import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoPeople,
  IoEye,
  IoTime,
  IoDocumentText,
  IoStatsChart,
} from "react-icons/io5";
import styles from "./Reports.module.scss";
import UsersView from "./components/UsersView";
import InsightsView from "./components/InsightsView";
import LearningStructuresView from "./components/LearningStructuresView";
import TopStudentsView from "./components/TopStudentsView";
import TrainingTimeView from "./components/TrainingTimeView";
import CustomSelect from "@components/CustomSelect/CustomSelect";
import { useQuery } from "@apollo/client";
import { GET_ALL_STUDENT_GROUPS } from "@quiries/groups/getAllGroups";
import TestPassRateView from "./components/TestPassRateView";
import { PiRanking } from "react-icons/pi";

type TabType =
  | "users"
  | "insights"
  | "learningStructures"
  | "topStudents"
  | "testPassRate"
  | "trainingTime";

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  // const [dateFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const { data: groups } = useQuery(GET_ALL_STUDENT_GROUPS, {
    fetchPolicy: "network-only",
  });
  const groupsOptions = groups?.getAllStudentGroups?.data.map(
    (group: { name: string; id: string }) => ({
      label: group.name,
      value: group.id,
    })
  );

  const tabs = [
    { id: "users", label: t("reports.users"), icon: <IoPeople /> },
    { id: "insights", label: t("reports.insights"), icon: <IoEye /> },
    {
      id: "learningStructures",
      label: t("reports.learningStructures"),
      icon: <IoStatsChart />,
    },
    {
      id: "topStudents",
      label: t("reports.topStudents"),
      icon: <PiRanking />,
    },
    {
      id: "testPassRate",
      label: t("reports.testPassRate"),
      icon: <IoDocumentText />,
    },
    { id: "trainingTime", label: t("reports.trainingTime"), icon: <IoTime /> },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case "users":
        return <UsersView groupId={groupFilter} />;
      case "insights":
        return <InsightsView groupId={groupFilter} />;
      case "learningStructures":
        return <LearningStructuresView groupId={groupFilter} />;
      case "topStudents":
        return <TopStudentsView groupId={groupFilter} />;
      case "testPassRate":
        return <TestPassRateView groupId={groupFilter} />;
      case "trainingTime":
        return <TrainingTimeView groupId={groupFilter} />;
      default:
        return <UsersView groupId={groupFilter} />;
    }
  };

  // useEffect(() => {
  //   console.log(groupFilter);
  // }, [groupFilter]);

  return (
    <div className={styles.reportsContainer}>
      {/* Header */}
      <div className={styles.header}>
        {/* <h1 className={styles.title}>{t("reports.trainingStatistics")}</h1> */}

        <div className={styles.filters}>
          <CustomSelect
            placeholder={t(`reports.group`)}
            options={groupsOptions || []}
            value={groupFilter}
            onSelect={(val) => setGroupFilter(val)}
            translate={false}
          />
          {/* <button className={styles.filterButton}>
            <IoCalendar />
            {t("reports.date")}
          </button>
          <button
            className={`${styles.filterButton} ${
              dateFilter === "all" ? styles.active : ""
            }`}
          >
            {t("reports.all")}
          </button>
          <button className={styles.filterButton}>
            <IoFilter />
            {t("reports.compare")}
          </button> */}
        </div>
      </div>

      <div className={styles.content}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <div className={styles.tabGrid}>
            {tabs.map((tab) => (
              <div key={tab.id} className={styles.tabButtonContainer}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                >
                  <div className={styles.tabIcon}>{tab.icon}</div>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.contentVerticalBorder} />
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default Reports;

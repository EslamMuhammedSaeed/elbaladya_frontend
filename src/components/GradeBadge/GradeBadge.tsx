import React from "react";
import styles from "./GradeBadge.module.scss";

interface Props {
  grade: string;
  gradeKey: string;
}

export const GradeBadge: React.FC<Props> = ({ grade, gradeKey }) => {
  return (
    <td>
      <span className={`${styles.badge} ${styles[gradeKey]}`}>{grade}</span>
    </td>
  );
};

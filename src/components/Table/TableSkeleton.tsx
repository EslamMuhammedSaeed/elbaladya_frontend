import React from "react";
import Skeleton from "@components/Skeleton/Skeleton";
import styles from "./TableSkeleton.module.scss";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  rowHeight?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 5,
  rowHeight = 40,
}) => {
  return (
    <div className={styles.skeletonTableWrapper}>
      <table className={styles.skeletonTable}>
        <tbody>
          {[...Array(rows)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {[...Array(columns)].map((_, colIdx) => (
                <td className={styles.skeletonTableCell} key={colIdx}>
                  <Skeleton height={rowHeight} width="100%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;

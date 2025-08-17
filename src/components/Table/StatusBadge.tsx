import styles from "./Table.module.scss";
export type StatusType =
  | "completed"
  | "processing"
  | "rejected"
  | "disabled"
  | "cancelled"
  | "APPLYING"
  | "SUBMITTED"
  | "submitted"
  | "QUALIFIED"
  | "UNQUALIFIED";
interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <td
      className={`${styles[status?.toLowerCase().replaceAll(" ", "-")]} ${
        styles["status"]
      }`}
    >
      <span>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>
    </td>
  );
};

export default StatusBadge;

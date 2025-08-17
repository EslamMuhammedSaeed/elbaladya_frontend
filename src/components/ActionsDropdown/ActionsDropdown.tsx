import { useState, useRef, useEffect } from "react";
import styles from "./ActionsDropdown.module.scss";

import { BsThreeDotsVertical } from "react-icons/bs";
import type { TableAction } from "@utils/types";
import { useTranslation } from "react-i18next";
interface ActionsDropdownProps<T> {
  actions: TableAction<T>[];
  row: T;
}
export default function ActionsDropdown<T>({
  actions,
  row,
}: ActionsDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // const handleClick = useCallback(
  //   async () => {
  //     try {

  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [navigate, fetchNotifications]
  // );
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.notificationsWrapper} ref={wrapperRef}>
      <button
        className={styles.button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <BsThreeDotsVertical className={styles.icon} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {actions?.map((action, index) => (
            <div key={index}>
              <div
                className={`${styles.notificationItem}
                    `}
              >
                <button
                  onClick={() => {
                    action.onClick(row);
                  }}
                  className={action.label === "delete" ? styles.delete : ""}
                >
                  {action.icon}

                  <p>{t(`table.${action.label}`)}</p>
                </button>
                <div className={styles.dividerGray}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

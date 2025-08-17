import { useRef, useState, useEffect } from "react";
import styles from "./DatePicker.module.scss";
import { FaRegCalendarAlt } from "react-icons/fa";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const dateRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleIconClick = () => {
    dateRef.current?.showPicker(); // modern browsers
    // or dateRef.current?.click(); as fallback
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  // const formatDate = (value: string) => {
  //   if (!value) return "";
  //   const date = new Date(value);
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  // };

  const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.datePicker}>
      <input
        ref={dateRef}
        type="date"
        className={styles.hiddenDateInput}
        value={selectedDate}
        onChange={handleDateChange}
      />
      <span className={styles.placeholder}>
        {selectedDate ? formatDate(selectedDate) : "اختر التاريخ"}
      </span>
      <button type="button" className={styles.icon} onClick={handleIconClick}>
        <FaRegCalendarAlt />
      </button>
    </div>
  );
}

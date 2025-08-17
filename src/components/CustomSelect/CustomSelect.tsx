import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.scss";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  value?: string;
  translate?: boolean;
};

export default function CustomSelect({
  options,
  placeholder = "اختر من القائمة",
  onSelect,
  value,
  translate = true,
}: CustomSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(
    options.find((o) => o.value === value) || null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);
    onSelect(option.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelected(options.find((o) => o.value === value) || null);
  }, [value, options]);

  return (
    <div
      className={styles.customSelect}
      ref={containerRef}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.display}>
        <span className={styles.text}>
          {selected
            ? translate
              ? t(`table.${selected.label}`)
              : selected.label
            : placeholder}
        </span>
        <FaChevronDown className={styles.icon} />
      </div>
      {open && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
            >
              {translate ? t(`table.${option.label}`) : option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

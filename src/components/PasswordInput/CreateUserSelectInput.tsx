// src/components/Input.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./CreateUserInput.module.scss";

// import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";

type Option = {
  label: string;
  value: string;
};
interface InputProps {
  label?: string;
  value: string;
  onSelect: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

const CreateUserSelectInput: React.FC<InputProps> = ({
  label,
  value,
  onSelect,
  placeholder = "",
  error = "",
  className = "",
  options,
}) => {
  // const { t } = useTranslation();
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
    <div className={`${styles.inputContainer} w-100 ${className}`}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <div className={styles.inputWrapper}>
        <div
          className={styles.customSelect}
          ref={containerRef}
          onClick={() => setOpen(!open)}
        >
          <div className={styles.display}>
            <span className={styles.text}>
              {selected ? selected.label : placeholder}
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
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default CreateUserSelectInput;

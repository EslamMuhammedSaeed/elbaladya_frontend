import styles from "./SelectFilledInput.module.scss";

interface SelectFilledInputProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  animation?: boolean;
  badge?: string;
  required?: boolean;
  error?: string;
}

export default function SelectFilledInput({
  label,
  options,
  value,
  onChange,
  name,
  animation = false,
  badge,
  required = false,
  error,
}: SelectFilledInputProps) {
  return (
    <>
      <div
        className={`${styles.customSelect} ${value ? styles.filled : ""} ${
          animation ? "" : styles.notAnimated
        }`}
      >
        <select
          value={value}
          onChange={onChange}
          name={name}
          className={`${styles.selectInput} ${
            animation ? "" : styles.notAnimated
          }`}
        >
          <option value="" disabled hidden></option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          className={`${styles.label} ${
            animation ? styles.animated : styles.notAnimated
          }`}
        >
          {label}
          {badge && <span className={styles.badge}>{badge}</span>}
          {required && <span className={styles.required}>*</span>}
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}

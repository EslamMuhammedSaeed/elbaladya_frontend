import { useState } from "react";
import styles from "./FilledInput.module.scss";

import { FiEye, FiEyeOff } from "react-icons/fi";

interface CustomInputProps {
  label: string;
  type?:
    | "text"
    | "password"
    | "number"
    | "date"
    | "amount"
    | "email"
    | "tel"
    | "url"
    | "duration";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal"
    | undefined;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
  animation?: boolean;
  badge?: string;
  error?: string;
}

// const unformatAmount = (formatted: string): string => {
//   return formatted.replace(/,/g, "");
// };

export default function FilledInput({
  label,
  type = "text",
  value,
  onChange,
  name,
  autoComplete,
  inputMode = "text",
  disabled = false,
  required = false,
  labelClassName = "",
  animation = true,
  badge,
  error,
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  // const [displayValue, setDisplayValue] = useState(value);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const formatAmount = (value: string): string => {
    if (value === null) return "";
    const [integerPart, decimalPart] = String(value).split(".");
    const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${withCommas}.${decimalPart}`
      : withCommas;
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");

    // Allow only numbers and a single dot
    if (!/^\d*\.?\d*$/.test(raw)) return;

    // Limit to 2 decimal places
    const [, decimalPart] = raw.split(".");
    if (decimalPart?.length > 2) return;

    // const formatted = formatAmount(raw);
    // setDisplayValue(formatted);

    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: raw,
      },
    });
  };

  const formatDuration = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4); // max 4 digits

    if (digitsOnly.length <= 2) return digitsOnly;
    return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDuration(e.target.value);

    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: formatted,
      },
    });
  };
  // useEffect(() => {
  //   console.log(name, value, "here", formatAmount(value));
  // }, [value, name, displayValue]);
  return (
    <>
      <div
        className={`${styles.filledInput} ${value ? styles.filled : ""} ${
          animation ? "" : styles.notAnimated
        }`}
      >
        {/* <input
        type={inputType}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        required
        inputMode={inputMode}
        disabled={disabled}
        className={`${animation ? "" : styles.notAnimated}`}
      /> */}

        <input
          type={type === "amount" || type === "duration" ? "text" : inputType}
          value={
            type === "amount"
              ? formatAmount(value)
              : type === "duration"
              ? formatDuration(value)
              : value
          }
          onChange={
            type === "amount"
              ? handleAmountChange
              : type === "duration"
              ? handleDurationChange
              : onChange
          }
          placeholder={type === "duration" ? "00:00" : undefined}
          maxLength={type === "duration" ? 5 : undefined}
          name={name}
          autoComplete={autoComplete}
          required={required}
          inputMode={inputMode}
          disabled={disabled}
          className={`${animation ? "" : styles.notAnimated}`}
        />
        <label
          className={`${styles.label} ${labelClassName} ${
            animation ? styles.animated : styles.notAnimated
          }`}
        >
          {label} {badge && <span className={styles.badge}>{badge}</span>}
          {required && <span className={styles.required}>*</span>}
        </label>
        {isPassword && (
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}

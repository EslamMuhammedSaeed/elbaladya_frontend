// src/components/Input.tsx
import React from "react";
import styles from "./CreateUserInput.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PhoneInput: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const phoneRegex = /^[0-9+]*$/;

    if (value.length <= 15 && phoneRegex.test(value)) {
      onChange(e);
    }
  };
  return (
    <>
      {label && <label className={styles.inputLabel}>{label}</label>}
      {/* <div className={styles.inputWrapper}> */}
      <input
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={` ${error ? styles.inputError : ""}`}
        inputMode="tel"
        pattern="[0-9+]*"
        {...props}
      />
      {/* </div> */}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </>
  );
};

export default PhoneInput;

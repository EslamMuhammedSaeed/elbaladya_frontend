// src/components/Input.tsx
import React, { useState } from "react";
import styles from "./CreateUserInput.module.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  showStrengthIndicator?: boolean;
}

const CreateUserInput: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
  required = false,
  showStrengthIndicator = false,
  ...props
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`${styles.inputContainer} w-100 ${className}`}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${styles.inputField} ${error ? styles.inputError : ""}`}
          {...props}
        />
        {isPassword && (
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {isPassword && showStrengthIndicator && value && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
};

export default CreateUserInput;

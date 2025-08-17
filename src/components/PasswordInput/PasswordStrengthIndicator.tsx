import React from "react";
import styles from "./PasswordStrengthIndicator.module.scss";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthCriteria {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const criteria: StrengthCriteria[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: false,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: false,
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      met: false,
    },
    {
      label: "Contains number",
      test: (pwd) => /\d/.test(pwd),
      met: false,
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      met: false,
    },
  ];

  // Update criteria based on current password
  criteria.forEach((criterion) => {
    criterion.met = criterion.test(password);
  });

  const metCriteria = criteria.filter((criterion) => criterion.met).length;
  const totalCriteria = criteria.length;

  const getStrengthLevel = () => {
    const percentage = (metCriteria / totalCriteria) * 100;
    if (percentage === 0)
      return { level: "none", color: "#e0e0e0", text: "Very Weak" };
    if (percentage <= 20)
      return { level: "weak", color: "#ff4444", text: "Weak" };
    if (percentage <= 40)
      return { level: "fair", color: "#ff8800", text: "Fair" };
    if (percentage <= 60)
      return { level: "good", color: "#ffcc00", text: "Good" };
    if (percentage <= 80)
      return { level: "strong", color: "#00cc00", text: "Strong" };
    return { level: "very-strong", color: "#008800", text: "Very Strong" };
  };

  const strength = getStrengthLevel();

  return (
    <div className={styles.strengthContainer}>
      <div className={styles.strengthBar}>
        <div
          className={styles.strengthFill}
          style={{
            width: `${(metCriteria / totalCriteria) * 100}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      {/* <div className={styles.strengthText}>
        <span className={styles.strengthLabel}>Password Strength:</span>
        <span
          className={styles.strengthValue}
          style={{ color: strength.color }}
        >
          {strength.text}
        </span>
      </div> */}
      {/* <div className={styles.criteriaList}>
        {criteria.map((criterion, index) => (
          <div
            key={index}
            className={`${styles.criterion} ${
              criterion.met ? styles.met : styles.unmet
            }`}
          >
            <span className={styles.criterionIcon}>
              {criterion.met ? "✓" : "○"}
            </span>
            <span className={styles.criterionText}>{criterion.label}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default PasswordStrengthIndicator;

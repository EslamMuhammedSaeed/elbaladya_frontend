// src/components/Button.tsx
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[`${variant}`]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

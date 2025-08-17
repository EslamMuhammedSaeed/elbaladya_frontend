import styles from "./Login.module.scss";
import loginImage from "@assets/images/login.png";
import Input from "@components/Input/Input.tsx";
import Button from "@components/Button/Button.tsx";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "@context/DarkModeContext";
import { useMutation } from "@apollo/client";
import { useAuth } from "@context/AuthContext";
import { ADMIN_LOGIN } from "@mutations/auth/adminLogin";
import type {
  AdminLoginResponse,
  AdminLoginVariables,
} from "@mutations/auth/adminLogin";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "@utils/validation";
// import { simpleHash } from "@utils/hash";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isDark } = useDarkMode();
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.state, navigate]);

  const [adminLogin, { loading: mutationLoading }] = useMutation<
    AdminLoginResponse,
    AdminLoginVariables
  >(ADMIN_LOGIN);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailError =
      validateRequired("البريد الإلكتروني", email) || validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError =
      validateRequired("رمز المرور", password) || validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);

    // Optional: return a boolean if needed
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await adminLogin({
        variables: {
          email,
          hashedPassword: password,
        },
      });

      if (response.data?.adminLoginMain) {
        const { token, admin } = response.data.adminLoginMain;
        login(token, admin);

        // Redirect to the intended page or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
      });
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.loginContainer} ${isDark ? styles.dark : ""}`}>
      {/* Left Section - Form */}

      <div className={styles.loginFormSection}>
        <div className={styles.loginInfo}>
          يجب ان يكون لديك حساب لتستطيع تسجيل الدخول
        </div>
        <div className={styles.loginForm}>
          <div className={styles.loginTitle}>تسجيل الدخول</div>
          <div className={styles.divider}></div>
          <div className="mb-3 w-100">
            <Input
              name="email"
              label="ادخل اسم المستخدم"
              type="text"
              placeholder=""
              value={email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              name="password"
              label="ادخل كلمة المرور"
              type="password"
              placeholder=""
              value={password}
              onChange={handleChange}
              error={errors.password}
            />
            {errors.general && (
              <div className="text-danger mt-2 text-center">
                {errors.general}
              </div>
            )}
          </div>
          <NavLink to={""} className={styles.forgotPassword}>
            نسيت كلمة المرور؟
          </NavLink>
          <Button
            type="button"
            variant="success"
            onClick={() => {
              handleSubmit();
            }}
            disabled={mutationLoading}
          >
            {mutationLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className={styles.loginImageContainer}>
        <img
          src={loginImage}
          alt="Login Illustration"
          className={styles.loginImage}
        />
      </div>
    </div>
  );
}

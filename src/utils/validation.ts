export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required.";
  if (!emailRegex.test(email)) return "بريد إلكتروني غير صالح.";
  return null;
};

export const validateRequired = (
  name: string,
  value: string
): string | null => {
  if (!value.trim()) return `${name} مطلوب.`;
  return null;
};

export const validateAlphanumeric = (
  name: string,
  value: string,
  required: boolean
): string | null => {
  const trimmed = value.trim();

  if (!trimmed && required) return `${name} is required.`;

  // Accept only English/Arabic letters and numbers — no spaces or symbols
  const alphaNumRegex = /^[a-zA-Z0-9\u0600-\u06FF]+$/;

  if (!alphaNumRegex.test(trimmed)) {
    return "Only letters and numbers are allowed, no spaces or symbols.";
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  const nameTrimmed = name.trim();

  if (!nameTrimmed) return "Full name is required.";

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u0600-\u06FF\s'-]{2,}$/;

  if (!nameRegex.test(nameTrimmed)) {
    return "Full name must contain only letters and valid characters.";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword.trim()) return "Confirmation password is required.";
  if (confirmPassword !== password) return "Passwords do not match.";
  return null;
};

export const validateOTP = (otp: string): string | null => {
  const otpRegex = /^\d{6}$/; // Matches exactly 6 numeric digits
  if (!otpRegex.test(otp)) return "Invalid OTP format."; // Invalid OTP format
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const trimmed = phone.trim();

  if (!trimmed) return "Phone number is required.";

  // const phoneRegex = /^\+?[0-9]{10,15}$/;
  const phoneRegex = /^[0-9]{9}$/;

  if (!phoneRegex.test(trimmed)) {
    return "Phone number must be exactly 9 digits.";
  }

  return null;
};

export const validateNIN2 = (input: string): string | null => {
  const regex = /^(CM|CF|PM|PF|cm|cf|pm|pf)[A-Za-z0-9]{12}$/;
  if (!regex.test(input)) {
    return "Invalid NIN format.";
  }

  return null;
};

export const validateNIN = (input: string): string | null => {
  const regex = /^[A-Za-z0-9]{13,14}$/;
  if (!regex.test(input)) {
    return "NIN must be alphanumeric and 13 to 14 characters long.";
  }

  return null;
};

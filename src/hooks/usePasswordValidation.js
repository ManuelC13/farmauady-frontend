import { useState } from "react";

export function usePasswordValidation() {
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const validate = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const reset = () => {
    setPasswordValidation({
      length: false,
      upper: false,
      lower: false,
      number: false,
      special: false,
    });
  };

  const isValid = Object.values(passwordValidation).every(Boolean);

  return { passwordValidation, validate, isValid, reset };
}
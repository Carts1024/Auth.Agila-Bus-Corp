/* eslint-disable @next/next/no-img-element */
'use client';

import Link from "next/link";
import { useState } from "react";
import styles from "./login.module.css";

interface LoginFormProps {
  formData: {
    employeeNumber: string;    // <-- changed from employeeId
    password: string;
  };
  errors: {
    employeeNumber: string;    // <-- changed from employeeId
    password: string;
    general: string;
  };
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}: LoginFormProps) {

  //Handle the state of the eye icon
  const [showPassword, setShowPassword] = useState(false); 

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <img
            src="/assets/images/agila-Logo.png"
            alt="Agila Bus Corporation Logo"
            width={200}
            height={150}
            className={styles.logo}
          />
          <h2 className={styles.title}>
            AGILA Bus Transportation
          </h2>
          <p className={styles.subtitle}>
            Login your credentials
          </p>
          {errors.general && (
            <div className={styles.errorMessage}>
              {errors.general}
            </div>
          )}
          <label htmlFor="employeeNumber" className={styles.label}>
            Employee Number
          </label>
          <input
            type="text"
            id="employeeNumber"
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
            placeholder="Employee Number here..."
            required
            className={`${styles.input} ${errors.employeeNumber ? styles.inputError : ''}`}
          />
          {errors.employeeNumber && (
            <p className={styles.errorText}>
              {errors.employeeNumber}
            </p>
          )}
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password here..."
              required
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorText}>
              {errors.password}
            </p>
          )}
          <Link href="/authentication/reset-password" passHref>
            <div className={styles.resetPassword}>
              Reset password?
            </div>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

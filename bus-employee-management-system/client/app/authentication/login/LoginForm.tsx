/* eslint-disable @next/next/no-img-element */
'use client';

import Link from "next/link";
import styles from "./login.module.css";

interface LoginFormProps {
  formData: {
    roleId: string;
    employeeId: string;
    password: string;
  };
  errors: {
    roleId: string;
    employeeId: string;
    password: string;
    general: string;
  };
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  roles: { id: number; name: string }[];
}

export default function LoginForm({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
  roles,
}: LoginFormProps) {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div style={{ flex: 1 }}></div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <img
            src="/assets/images/agila logo.png"
            alt="Agila Bus Corporation Logo"
            width={150}
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
          <label htmlFor="roleId" className={styles.label}>
            Role
          </label>
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
            className={`${styles.input} ${errors.roleId ? styles.inputError : ''}`}
          >
            <option value="" disabled>
              Select your role
            </option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className={styles.errorText}>
              {errors.roleId}
            </p>
          )}
          
          <label htmlFor="employeeId" className={styles.label}>
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="Employee Id here..."
            required
            className={`${styles.input} ${errors.employeeId ? styles.inputError : ''}`}
          />
          {errors.employeeId && (
            <p className={styles.errorText}>
              {errors.employeeId}
            </p>
          )}
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password here..."
            required
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          />
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
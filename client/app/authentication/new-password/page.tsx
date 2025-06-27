'use client';

import React, { Suspense, useState } from 'react';
import styles from './NewPassword.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNewPasswordLogic } from './NewPasswordLogic';
import '@/app/globals.css'

function NewPasswordForm() {
  const {
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    showError,
    handleSubmit,
    apiError,
    passwordError,
  } = useNewPasswordLogic();



  // Add states for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstTime = searchParams.get('first') === 'true';
  const isMandatory = searchParams.get('mandatory') === 'true';

  const getTitle = () => {
    if (isMandatory) return 'Complete Your Setup';
    if (isFirstTime) return 'Set Your Password';
    return 'Reset Your Password';
  };

  const getSubtitle = () => {
    if (isMandatory) return 'Almost done! Please set your new password to complete the setup process.';
    if (isFirstTime) return 'Welcome! Please set your password for your first login.';
    return 'Please enter and confirm your new password.';
  };

  return (
    <div className={styles.base}>
      <div className={styles.resetContainer}>
        <h1>{getTitle()}</h1>
        <h5>{getSubtitle()}</h5>
        <br /><br />

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className={styles.input}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className={styles.eyeButton}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
            </button>
          </div>

          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={styles.eyeButton}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
            </button>
          </div>

          {showError && (
            <p className={styles.errorText}>Passwords do not match.</p>
          )}
          {apiError && (
            <p className={styles.errorText}>{apiError}</p>
          )}
          {passwordError && (
            <p className={styles.errorText}>{passwordError}</p>
          )}

          <div className={styles.cancelButton}>
            <button
              type="button"
              onClick={() => router.push('/authentication/login')}
            >
              Cancel
            </button>
          </div>

          <div className={styles.submitButton}>
            <button type="submit">Submit</button>
          </div>
        </form>

        <a
          onClick={() => router.push('/authentication/login')}
          className={styles.backLink}
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div className={styles.base}>Loading password page...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}

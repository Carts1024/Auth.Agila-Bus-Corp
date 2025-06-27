/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useNewPasswordLogic() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [apiError, setApiError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const employeeNumber = searchParams.get('employeeNumber');
  const isMandatory = searchParams.get('mandatory') === 'true';

  const validateForm = () => {
    let isValid = true;
    setPasswordError('');
    setShowError(false);

    if (!newPassword || !confirmPassword) {
      setPasswordError('Both fields are required.');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setShowError(true);
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-[\]{}|;:,.<>?]{8,20}$/.test(newPassword)
    ) {
      setPasswordError(
        'Password must be 8-20 characters with at least one uppercase, one lowercase, one number, and one special character'
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      let endpoint: string;
      let payload: { token?: string; employeeNumber?: string; newPassword: string };

      if (token) {
        // Token-based reset (forgot password flow)
        endpoint = `/auth/reset-password`;
        payload = { token, newPassword };
      } else if (isMandatory) {
        // Mandatory reset after security question setup
        endpoint = `/auth/mandatory-password-reset`;
        payload = { employeeNumber: employeeNumber!, newPassword };
      } else {
        // First time password reset (legacy)
        endpoint = `/auth/first-password-reset`;
        payload = { employeeNumber: employeeNumber!, newPassword };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('Password updated successfully! Redirecting to login...');
        setTimeout(() => router.push('/authentication/login'), 2000);
      } else {
        setApiError(data.message || 'An error occurred while updating the password.');
      }
    } catch {
      setApiError('An error occurred while updating the password. Please try again later.');
    }
  };

  return {
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    showError,
    passwordError,
    handleSubmit,
    apiError,
  };
}

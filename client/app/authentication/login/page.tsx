/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { logout } from "@/app/utils/logout";
import '@/app/globals.css'

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeNumber: '',    // <-- changed from employeeId
    password: ''
  });
  const [errors, setErrors] = useState({
    employeeNumber: '',    // <-- changed from employeeId
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logout();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      employeeNumber: '',    // <-- changed from employeeId
      password: '',
      general: ''
    };

    if (!formData.employeeNumber) {
      newErrors.employeeNumber = 'Employee Number is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9@._-]{4,20}$/.test(formData.employeeNumber)) {
      newErrors.employeeNumber = 'Employee Number must be 4-20 characters and can contain letters, numbers, @, ., _, or -';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+[\]{}|;:,.<>?]{8,20}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8-20 characters with at least one uppercase, one lowercase, one number, and one special character';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),    // <-- now has employeeNumber
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        // Check if user needs to set up security question
        if (data.requiresSecuritySetup) {
          router.push(
            `/authentication/security-question-setup?employeeNumber=${encodeURIComponent(
              formData.employeeNumber
            )}`
          );
          return;
        }
        
        // Check if user needs to reset password (security question already set)
        if (data.requiresPasswordReset) {
          router.push(
            `/authentication/new-password?mandatory=true&employeeNumber=${encodeURIComponent(
              formData.employeeNumber
            )}`
          );
          return;
        }

        // Normal successful login - redirect based on role
        const role = data.role;
        const redirectMap: Record<string, string> = {
          'Admin': process.env.NEXT_PUBLIC_REDIRECT_HR!,
          'HR Manager': process.env.NEXT_PUBLIC_REDIRECT_HR!,
          'Accountant': process.env.NEXT_PUBLIC_REDIRECT_FINANCE!,
          'Inventory Manager': process.env.NEXT_PUBLIC_REDIRECT_INVENTORY!,
          'Operations Manager': process.env.NEXT_PUBLIC_REDIRECT_OPERATIONS!,
          'Dispatcher': process.env.NEXT_PUBLIC_REDIRECT_OPERATIONS!,
        };
        const redirectUrl = redirectMap[role] || 'https://auth.agilabuscorp.me';
        window.location.href = redirectUrl;
      } else if (response.status === 403) {
        // Fallback for old flow (if still needed)
        router.push(
          `/authentication/new-password?first=true&employeeNumber=${encodeURIComponent(
            formData.employeeNumber
          )}`
        );
      } else {
        setErrors(prev => ({
          ...prev,
          general: data.message || 'Invalid credentials. Please try again.',
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred. Please try again later.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginForm
      formData={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}

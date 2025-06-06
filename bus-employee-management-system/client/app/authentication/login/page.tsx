/* eslint-disable @typescript-eslint/no-unused-vars */
 
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { logout } from "@/app/utils/logout";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roleId: '',
    employeeId: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    roleId: '',
    employeeId: '',
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    
    const fetchRoles = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log('Using API base:', API_BASE_URL);
      try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setErrors(prev => ({
          ...prev,
          general: 'Failed to load roles. Please try again later.'
        }));
      }
    };
    logout();
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      roleId: '',
      employeeId: '',
      password: '',
      general: ''
    };

    if (!formData.roleId) {
      newErrors.roleId = 'Please select your role';
      valid = false;
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9@._-]{4,20}$/.test(formData.employeeId)) {
      newErrors.employeeId = 'Employee ID must be 4-20 characters and can contain letters, numbers, @, ., _, or -';
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
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (response.ok) {
        // Use router.push to stay on the same domain
        router.push('/homepage');
      } else if (response.status === 403) {
        router.push(
          `/authentication/new-password?first=true&employeeID=${encodeURIComponent(
            formData.employeeId
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
      roles={roles}
    />
  );
}
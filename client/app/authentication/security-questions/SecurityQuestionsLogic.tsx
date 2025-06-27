/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// --- LOGIC HOOK ---
export function useSecurityQuestionsLogic() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Fetch question on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (token) {
          // New flow: fetch question using token
          const res = await fetch('/api/auth/security-question-with-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (res.ok) {
            setQuestion(data.securityQuestion);
            setUserEmail(data.email);
          } else {
            setErrors(data.message || 'Invalid or expired link.');
          }
        } else if (email) {
          // Old flow: fetch question using email
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${API_BASE_URL}/auth/request-security-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (res.ok) {
            setQuestion(data.securityQuestion);
            setUserEmail(email);
          } else {
            setErrors(data.message || 'Failed to fetch question.');
          }
        } else {
          setErrors('Invalid access. Please start the password reset process again.');
          router.push('/authentication/reset-password');
        }
      } catch (error) {
        setErrors('Failed to load security question. Please try again.');
      }
    };

    fetchQuestion();
  }, [email, token, router]);

  // Handle answer input change
  const handleAnswerChange = (v: string) => {
    setAnswer(v);
    setErrors('');
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors('');
    setSubmitting(true);

    if (answer.trim() === '') {
      setErrors('Please provide your answer.');
      setSubmitting(false);
      return;
    }

    try {
      if (token) {
        // New flow: validate answer with token
        const res = await fetch('/api/auth/validate-security-answer-with-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, answer }),
        });
        const data = await res.json();

        if (res.ok) {
          // Redirect to password reset with token
          router.push(`/authentication/new-password?token=${token}`);
        } else {
          setErrors(data.message || 'Incorrect answer. Please try again.');
        }
      } else if (email) {
        // Old flow: validate answer with email
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_BASE_URL}/auth/validate-security-answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, answer }),
        });
        const data = await res.json();

        if (res.ok) {
          alert('If your answer is correct, a reset link was sent to your email.');
          router.push('/authentication/login');
        } else {
          setErrors(data.message || 'Incorrect answer. Please try again.');
        }
      }
    } catch (error) {
      setErrors('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    question,
    answer,
    errors,
    submitting,
    handleAnswerChange,
    handleSubmit,
  };
}

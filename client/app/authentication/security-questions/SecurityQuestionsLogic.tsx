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
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  // Fetch question on mount
  useEffect(() => {
    if (!email) return;
    const fetchQuestion = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE_URL}/auth/request-security-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.securityQuestion);
      } else {
        setErrors(data.message || 'Failed to fetch question.');
      }
    };
    fetchQuestion();
  }, [email]);

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
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE_URL}/auth/validate-security-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answer }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('If your answer is correct, a reset link was sent to your email.');
        router.push('/authentication/login');
      } else {
        setErrors(data.message || 'Incorrect answer. Please try again.');
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

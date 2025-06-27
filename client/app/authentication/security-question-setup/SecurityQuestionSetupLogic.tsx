'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface SecurityQuestion {
  id: number;
  question: string;
}

interface Errors {
  question: string;
  answer: string;
  general: string;
}

export function useSecurityQuestionSetupLogic() {
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState<Errors>({
    question: '',
    answer: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeNumber = searchParams.get('employeeNumber');

  // Fetch all security questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_BASE_URL}/auth/security-questions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (res.ok) {
          const data = await res.json();
          setSecurityQuestions(data.securityQuestions);
        } else {
          setErrors(prev => ({
            ...prev,
            general: 'Failed to load security questions.'
          }));
        }
      } catch {
        setErrors(prev => ({
          ...prev,
          general: 'Error loading security questions. Please try again.'
        }));
      }
    };

    fetchQuestions();
  }, []);

  // Redirect to login if no employee number
  useEffect(() => {
    if (!employeeNumber) {
      router.push('/authentication/login');
    }
  }, [employeeNumber, router]);

  const handleQuestionChange = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setErrors(prev => ({ ...prev, question: '' }));
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    setErrors(prev => ({ ...prev, answer: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Errors = { question: '', answer: '', general: '' };

    if (!selectedQuestionId) {
      newErrors.question = 'Please select a security question.';
      isValid = false;
    }

    if (!answer.trim()) {
      newErrors.answer = 'Please provide an answer.';
      isValid = false;
    } else if (answer.trim().length < 3) {
      newErrors.answer = 'Answer must be at least 3 characters long.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({ question: '', answer: '', general: '' });

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_BASE_URL}/auth/setup-security-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeNumber,
          securityQuestionId: selectedQuestionId,
          securityAnswer: answer.trim()
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to mandatory password reset
        router.push(
          `/authentication/new-password?mandatory=true&employeeNumber=${encodeURIComponent(
            employeeNumber || ''
          )}`
        );
      } else {
        setErrors(prev => ({
          ...prev,
          general: data.message || 'Failed to set up security question. Please try again.'
        }));
      }
    } catch {
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred. Please try again later.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    securityQuestions,
    selectedQuestionId,
    answer,
    errors,
    isSubmitting,
    handleQuestionChange,
    handleAnswerChange,
    handleSubmit,
  };
}

'use client';

import { useRouter } from 'next/navigation';
import styles from '../security-questions/SecurityQuestions.module.css';
import { useSecurityQuestionSetupLogic } from './SecurityQuestionSetupLogic';
import React, { Suspense } from 'react';
import '@/app/globals.css'

function SecurityQuestionSetupForm() {
  const router = useRouter();
  const {
    securityQuestions,
    selectedQuestionId,
    answer,
    errors,
    isSubmitting,
    handleQuestionChange,
    handleAnswerChange,
    handleSubmit,
  } = useSecurityQuestionSetupLogic();

  return (
    <div className={styles.base}>
      <div className={styles.questionsContainer}>
        <h1>Set Up Security Question</h1>
        <h5>Please select a security question and provide an answer. This will be used for password recovery.</h5>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="securityQuestion" className={styles.label}>Select a Security Question</label>
          <select
            id="securityQuestion"
            className={`${styles.input} ${errors.question ? styles.fieldError : ''}`}
            value={selectedQuestionId}
            onChange={(e) => handleQuestionChange(Number(e.target.value))}
          >
            <option value="">-- Select a question --</option>
            {securityQuestions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.question}
              </option>
            ))}
          </select>

          {errors.question && (
            <p className={styles.errorText}>{errors.question}</p>
          )}

          <label htmlFor="answer" className={styles.label}>Your Answer</label>
          <input
            id="answer"
            type="text"
            placeholder="Enter your answer"
            className={`${styles.input} ${errors.answer ? styles.fieldError : ''}`}
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />

          {errors.answer && (
            <p className={styles.errorText}>{errors.answer}</p>
          )}

          {errors.general && (
            <p className={styles.errorText}>{errors.general}</p>
          )}

          <div className={styles.cancelButton}>
            <button type="button" onClick={() => router.push('/authentication/login')}>
              Cancel
            </button>
          </div>

          <div className={styles.submitButton}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Setting up...' : 'Continue'}
            </button>
          </div>
        </form>

        <a onClick={() => router.push('/authentication/login')} className={styles.backLink}>
          Back to Login
        </a>
      </div>
    </div>
  );
}

export default function SecurityQuestionSetupPage() {
  return (
    <Suspense fallback={<div className={styles.base}>Loading...</div>}>
      <SecurityQuestionSetupForm />
    </Suspense>
  );
}

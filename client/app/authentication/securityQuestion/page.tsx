'use client';

import React from 'react';
import { useSecurityQuestionLogic } from './securityQuestionLogic';
import styles from './securityQuestion.module.css';

const SecurityQuestionPage: React.FC = () => {
  const {
    questions,
    selectedQuestion,
    answer,
    fieldErrors,
    serverMessage,
    isSubmitting,
    handleChangeQuestion,
    handleChangeAnswer,
    handleSubmit,
  } = useSecurityQuestionLogic();

  return (
    <div className={styles.base}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set Security Questions</h1>
        <p className={styles.description}>Please select a security question and provide an answer. This will help us verify your identity in the future.</p>

        <div className={styles.formGroup}>
          <label htmlFor="securityQuestion" className={styles.label}>Select Security Question</label>
          <select
            id="securityQuestion"
            className={`${styles.inputField} ${fieldErrors.selectedQuestion ? styles.inputError : ''}`}
            value={selectedQuestion}
            onChange={(e) => handleChangeQuestion(e.target.value)}
          >
            <option value="">-- Choose a question --</option>
            {questions.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          {fieldErrors.selectedQuestion && <p className={styles.errorText}>{fieldErrors.selectedQuestion}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="answer" className={styles.label}>Your Answer</label>
          <input
            id="answer"
            type="text"
            className={`${styles.inputField} ${fieldErrors.answer ? styles.inputError : ''}`}
            value={answer}
            onChange={(e) => handleChangeAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          {fieldErrors.answer && <p className={styles.errorText}>{fieldErrors.answer}</p>}
        </div>

        {serverMessage.type === 'error' && <p className={styles.serverError}>{serverMessage.text}</p>}
        {serverMessage.type === 'success' && <p className={styles.serverSuccess}>{serverMessage.text}</p>}

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Security Question'}
        </button>
      </div>
    </div>
  );
};

export default SecurityQuestionPage;

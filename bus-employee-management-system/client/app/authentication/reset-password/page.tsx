/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import styles from './resetpassword.module.css';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/auth/request-security-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Invalid email. Please try again.');
      } else {
        // Success: Redirect to security answer page, pass email & question in URL
        router.push(`/authentication/security-questions?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.base}>
      <div className={styles.resetContainer}>
        <h1>Reset Password</h1>
        <h5>Provide the registered email address.</h5>
        <form onSubmit={handleSubmit}>
          <label htmlFor="EmailForResetPass">Email: </label>
          <input
            type="email"
            className={styles.input}
            name="EmailForResetPass"
            id="EmailForResetPass"
            placeholder="juandelacruz@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <div>
            {error ? <p className={styles.errorText}>{error}</p> : <div style={{ height: '0.5rem' }} />}
          </div>
          <div>
            <Link href="/" className={styles.cancelButton}>
              <Button text="Cancel" />
            </Link>
          </div>
          <div className={styles.submitButton}>
            <Button text={loading ? 'Checking...' : 'Submit'} />
          </div>
        </form>
        <div>
          <Link href="/" className={styles.backLink}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

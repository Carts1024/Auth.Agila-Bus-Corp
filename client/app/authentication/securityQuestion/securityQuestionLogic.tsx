import { useState } from 'react';
import { showSuccess, showError } from '@/app/utils/swal';
interface FieldErrors {
  selectedQuestion?: string;
  answer?: string;
}

interface ServerMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export const useSecurityQuestionLogic = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<ServerMessage>({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // dummy security questions lang pwede mo to change carl if u want
  const questions: string[] = [
    "What was your childhood nickname?",
    "What is the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is the name of your favorite book?",
    "What was the make and model of your first car?",
    "What is your favorite movie?",
    "What is the name of your elementary school?",
  ];

  const handleChangeQuestion = (value: string) => {
    setSelectedQuestion(value);
    setFieldErrors(prev => ({ ...prev, selectedQuestion: undefined }));
    setServerMessage({ type: '', text: '' }); 
  };

  const handleChangeAnswer = (value: string) => {
    setAnswer(value);
    setFieldErrors(prev => ({ ...prev, answer: undefined })); 
    setServerMessage({ type: '', text: '' }); 
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (!selectedQuestion) {
      errors.selectedQuestion = 'Please select a security question.';
      isValid = false;
    }

    if (!answer.trim()) {
      errors.answer = 'Please provide an answer.';
      isValid = false;
    } else if (answer.trim().length < 3) {
      errors.answer = 'Answer must be at least 3 characters long.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    setServerMessage({ type: '', text: '' });
    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      showSuccess('Success', 'Security question saved successfully!');
      setServerMessage({ type: 'success', text: 'Security question saved!' });

    } catch (error) {
      console.error('Failed to save security question:', error);
      showError('Error', 'Failed to save security question. Please try again.');
      setServerMessage({ type: 'error', text: 'Failed to save security question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questions,
    selectedQuestion,
    answer,
    fieldErrors,
    serverMessage,
    isSubmitting,
    handleChangeQuestion,
    handleChangeAnswer,
    handleSubmit,
  };
};

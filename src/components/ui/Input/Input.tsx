import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useField } from 'formik';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  name: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  name: string;
}

export const Input = ({ label, error, name, className = '', ...props }: InputProps) => {
  const [field, meta] = useField(name);
  const displayError = error || (meta.touched && meta.error);

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={props.id || name} className={styles.label}>
          {label}
        </label>
      )}
      <input
        {...field}
        {...props}
        id={props.id || name}
        className={`${styles.input} ${displayError ? styles.error : ''} ${className}`}
      />
      {displayError && <span className={styles.errorMessage}>{displayError}</span>}
    </div>
  );
};

export const Textarea = ({ label, error, name, className = '', ...props }: TextareaProps) => {
  const [field, meta] = useField(name);
  const displayError = error || (meta.touched && meta.error);

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={props.id || name} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        {...field}
        {...props}
        id={props.id || name}
        className={`${styles.textarea} ${displayError ? styles.error : ''} ${className}`}
      />
      {displayError && <span className={styles.errorMessage}>{displayError}</span>}
    </div>
  );
};


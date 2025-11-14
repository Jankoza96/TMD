import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Tag.module.scss';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'high' | 'normal' | 'low';
  onRemove?: () => void;
  className?: string;
}

export const Tag = ({ children, variant = 'default', onRemove, className = '' }: TagProps) => {
  return (
    <span className={`${styles.tag} ${styles[variant]} ${className}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Remove tag"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </span>
  );
};


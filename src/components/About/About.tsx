import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './About.module.scss';

const FEATURES = [
  'Advanced search with query syntax (priority:high AND tag:design)',
  'Real-time focus load indicators',
  'Dynamic due date countdowns',
  'Calendar and list views',
  'Tag-based organization',
  'Dark mode support',
  'Keyboard navigation',
  'Undo functionality',
];

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const About = ({ isOpen, onClose }: AboutProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.aboutOverlay} onClick={onClose}>
      <div className={styles.aboutModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close about">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.aboutContent}>
          <h1 className={styles.title}>TMD</h1>
          <p className={styles.version}>Version 1.0.0</p>

          <div className={styles.description}>
            <p>
              TMD is a powerful task management application designed to help you stay organized and productive.
              With advanced filtering, real-time statistics, and an intuitive interface, TMD adapts to your workflow.
            </p>

            <h2 className={styles.sectionTitle}>Features</h2>
            <ul className={styles.featuresList}>
              {FEATURES.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <div className={styles.footer}>
              <p className={styles.copyright}>
                Copyright © 2025 Janko Radovanovic. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


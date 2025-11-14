import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        Copyright © 2025 Janko Radovanovic. All rights reserved.
      </p>
    </footer>
  );
};


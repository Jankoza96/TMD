import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './SettingsMenu.module.scss';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAboutClick: () => void;
  anchorElement: HTMLElement | null;
}

export const SettingsMenu = ({ isOpen, onClose, onAboutClick, anchorElement }: SettingsMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && anchorElement && !anchorElement.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen || !anchorElement) return null;

  const rect = anchorElement.getBoundingClientRect();
  const menuStyle: React.CSSProperties = {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  };

  return (
    <div ref={menuRef} className={styles.settingsMenu} style={menuStyle}>
      <button
        className={styles.menuItem}
        onClick={() => {
          onAboutClick();
          onClose();
        }}
      >
        <FontAwesomeIcon icon={faInfoCircle} className={styles.menuIcon} />
        <span className={styles.menuLabel}>About</span>
      </button>
    </div>
  );
};


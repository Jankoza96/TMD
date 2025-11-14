import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faUser, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from '../../hooks/useDebounce';
import { calculateTodayFocusLoad } from '../../utils/focusLoad';
import { parseQuery } from '../../utils/queryParser';
import type { Task } from '../../types/task';
import { Button } from '../ui/Button/Button';
import { SettingsMenu } from '../SettingsMenu/SettingsMenu';
import styles from './Header.module.scss';

interface HeaderProps {
  onNewTask: () => void;
  onSearch: (query: string) => void;
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onAboutClick?: () => void;
  isMobile?: boolean;
  tasks?: Task[];
}

export const Header = ({ onNewTask, onSearch, onMenuToggle, onProfileClick, onAboutClick, isMobile = false, tasks = [] }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const focusLoad = calculateTodayFocusLoad(tasks);
  const parsedQuery = parseQuery(searchQuery);
  const hasAdvancedSyntax = parsedQuery.hasAdvancedSyntax;

  useEffect(() => {
    onSearch(debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      onSearch('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {isMobile && onMenuToggle && (
          <button
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        <h1 className={styles.logo}>TMD</h1>
      </div>
      <div className={styles.centerSection}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={hasAdvancedSyntax ? "Advanced query active" : "Search tasks... (try: priority:high AND tag:design)"}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={`${styles.searchInput} ${hasAdvancedSyntax ? styles.advancedQuery : ''}`}
            aria-label="Search tasks"
            title="Advanced search: Use priority:high, status:complete, tag:design with AND, OR, NOT operators"
          />
          {hasAdvancedSyntax && (
            <span className={styles.advancedBadge} title="Advanced query syntax detected">
              Advanced
            </span>
          )}
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.focusLoadWrapper}>
          <div
            className={`${styles.focusLoadIndicator} ${styles[focusLoad.level]}`}
            aria-label={`Focus load: ${focusLoad.level}. ${focusLoad.count} tasks today.`}
          />
          <div className={styles.focusLoadTooltip}>
            <div className={styles.tooltipHeader}>Focus Load</div>
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipStatus}>
                <strong>Current Status:</strong> {focusLoad.level.charAt(0).toUpperCase() + focusLoad.level.slice(1)}
              </div>
              <div className={styles.tooltipStats}>
                {focusLoad.count} task{focusLoad.count !== 1 ? 's' : ''} today
                {focusLoad.highPriorityCount > 0 && (
                  <span className={styles.highPriorityCount}>
                    {' '}• {focusLoad.highPriorityCount} high priority
                  </span>
                )}
              </div>
              <div className={styles.tooltipDivider} />
              <div className={styles.tooltipLegend}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.low}`} /> Green: Low (2-3 Normal tasks)
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.medium}`} /> Yellow: Medium (4+ Normal/High tasks)
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.high}`} /> Red: High (Multiple High priority or 6+ tasks)
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className={styles.iconButton}
          aria-label="User profile"
          onClick={onProfileClick}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
        <div className={styles.settingsWrapper}>
          <button
            ref={settingsButtonRef}
            className={`${styles.iconButton} ${isSettingsOpen ? styles.active : ''}`}
            aria-label="Settings"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
          <SettingsMenu
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onAboutClick={onAboutClick || (() => { })}
            anchorElement={settingsButtonRef.current}
          />
        </div>
        <Button onClick={onNewTask} variant="primary" size="md">
          <FontAwesomeIcon icon={faPlus} /> New Task
        </Button>
      </div>
    </header>
  );
};


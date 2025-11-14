import type { ViewFilter, ViewMode } from '../../types/task';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCalendar,
  faCheck,
  faList,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../hooks/useTheme';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  currentFilter: ViewFilter;
  currentViewMode: ViewMode;
  selectedTag: string | null;
  availableTags: string[];
  isCollapsed: boolean;
  onFilterChange: (filter: ViewFilter) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onTagSelect: (tag: string | null) => void;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export const Sidebar = ({
  currentFilter,
  currentViewMode,
  selectedTag,
  availableTags,
  isCollapsed,
  onFilterChange,
  onViewModeChange,
  onTagSelect,
  onToggleCollapse,
  isMobile = false,
}: SidebarProps) => {
  const { theme, toggleTheme } = useTheme();

  const navItems: { filter: ViewFilter; label: string; icon: IconDefinition }[] = [
    { filter: 'all', label: 'All Tasks', icon: faTasks },
    { filter: 'today', label: 'Today', icon: faSun },
    { filter: 'upcoming', label: 'Upcoming', icon: faCalendar },
    { filter: 'completed', label: 'Completed', icon: faCheck },
  ];

  return (
    <>
      {isMobile && (
        <div
          className={`${styles.overlay} ${isCollapsed ? styles.hidden : ''}`}
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobile ? styles.mobile : ''}`}
        aria-label="Navigation sidebar"
      >
        <div className={styles.sidebarHeader}>
          {!isCollapsed && <h2 className={styles.sidebarTitle}>Menu</h2>}
          <button
            className={styles.collapseButton}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>

        {!isCollapsed && (
          <>
            <div className={styles.content}>
              <nav className={styles.nav}>
                {navItems.map((item) => (
                  <button
                    key={item.filter}
                    className={`${styles.navItem} ${currentFilter === item.filter ? styles.active : ''}`}
                    onClick={() => onFilterChange(item.filter)}
                    aria-current={currentFilter === item.filter ? 'page' : undefined}
                  >
                    <span className={styles.icon}>
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className={styles.divider} />

              <div className={styles.tagsSection}>
                <h3 className={styles.tagsTitle}>Tags</h3>
                <div className={styles.tagsList}>
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => {
                      const isSelected = selectedTag && selectedTag.toLowerCase() === tag.toLowerCase();
                      return (
                        <button
                          key={tag}
                          className={`${styles.tagItem} ${isSelected ? styles.active : ''}`}
                          onClick={() => onTagSelect(isSelected ? null : tag)}
                        >
                          <span className={styles.tagCheckbox}>
                            {isSelected && <FontAwesomeIcon icon={faCheck} />}
                          </span>
                          <span className={styles.tagLabel}>{tag}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className={styles.noTags}>No tags available</p>
                  )}
                </div>
              </div>

              <div className={styles.viewModeSection}>
                <button
                  className={`${styles.viewModeButton} ${currentViewMode === 'list' ? styles.active : ''}`}
                  onClick={() => onViewModeChange('list')}
                  aria-label="List view"
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
                <button
                  className={`${styles.viewModeButton} ${currentViewMode === 'calendar' ? styles.active : ''}`}
                  onClick={() => onViewModeChange('calendar')}
                  aria-label="Calendar view"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </button>
              </div>
            </div>

            <div className={styles.themeToggle}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleSlider} />
              </label>
              <span className={styles.toggleText}>Dark Mode</span>
            </div>
          </>
        )}
      </aside>
    </>
  );
};


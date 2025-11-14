import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Task } from '../../types/task';
import styles from './Profile.module.scss';

interface ProfileProps {
  onClose: () => void;
  tasks: Task[];
}

export const Profile = ({ onClose, tasks }: ProfileProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userData = {
    name: 'Janko Radovanovic',
    email: 'janko.r96@gmail.com',
    phone: '+381643467746',
    location: 'Kragujevac, Serbia',
    joinDate: 'January 15, 2024',
    avatar: 'JR',
    bio: 'Productive task manager and software developer passionate about creating efficient workflows.',
    stats: {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
    },
  };

  return (
    <div className={styles.profileOverlay} onClick={onClose}>
      <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close profile">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{userData.avatar}</div>
          <h1 className={styles.name}>{userData.name}</h1>
          <p className={styles.bio}>{userData.bio}</p>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{userData.email}</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faPhone} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{userData.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Location:</span>
                <span className={styles.infoValue}>{userData.location}</span>
              </div>
              <div className={styles.infoItem}>
                <FontAwesomeIcon icon={faCalendarAlt} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Member since:</span>
                <span className={styles.infoValue}>{userData.joinDate}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Statistics</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.stats.totalTasks}</div>
                <div className={styles.statLabel}>Total Tasks</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.stats.completedTasks}</div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.stats.activeTasks}</div>
                <div className={styles.statLabel}>Active</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.stats.completionRate}%</div>
                <div className={styles.statLabel}>Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


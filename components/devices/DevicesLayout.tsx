import { ReactNode } from 'react';
import styles from '../../styles/components/devices-layout.module.css';

interface DevicesLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  viewMode?: 'list' | 'card';
  onViewModeChange?: (mode: 'list' | 'card') => void;
  loading?: boolean;
  error?: string;
}

export function DevicesLayout({
  children,
  title,
  subtitle = 'Connected Devices',
  viewMode,
  onViewModeChange,
  loading = false,
  error = ''
}: DevicesLayoutProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles['device-table-container']}>
        <div className={styles['header-controls']}>
          <h2 className={styles.subtitle}>{subtitle}</h2>
          {viewMode && onViewModeChange && (
            <div className={styles['view-controls']}>
              <label className={styles.label} htmlFor="view-mode">View Mode:</label>
              <select
                id="view-mode"
                value={viewMode}
                onChange={(e) => onViewModeChange(e.target.value as 'list' | 'card')}
                className={styles['view-mode-select']}
              >
                <option value="list">List View</option>
                <option value="card">Card View</option>
              </select>
            </div>
          )}
        </div>
        {loading ? (
          <p>Loading devices...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

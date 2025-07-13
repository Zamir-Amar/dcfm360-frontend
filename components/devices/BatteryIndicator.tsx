import { getBatteryLevelClass } from '../../hooks/useDevices';
import styles from '../../styles/components/battery-indicator.module.css';

interface BatteryIndicatorProps {
  batteryLevel: number | undefined;
}

export function BatteryIndicator({ batteryLevel }: BatteryIndicatorProps) {
  if (batteryLevel === undefined) {
    return <span className={styles['battery-text']}>Unknown</span>;
  }

  const levelClass = getBatteryLevelClass(batteryLevel);
  
  return (
    <div className={styles['battery-indicator-container']}>
      <div className={`${styles['battery-indicator']} ${styles[levelClass]}`}>
        <div className={styles['battery-body']}>
          <div 
            className={styles['battery-level']} 
            style={{width: `${Math.min(100, Math.max(0, batteryLevel))}%`}}
          ></div>
        </div>
        <div className={styles['battery-cap']}></div>
      </div>
      <span className={styles['battery-text']}>{batteryLevel}%</span>
    </div>
  );
}

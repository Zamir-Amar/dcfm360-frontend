import { getSignalStrengthClass } from '../../hooks/useDevices';
import styles from '../../styles/components/wifi-indicator.module.css';

interface WiFiIndicatorProps {
  signalStrength: string | undefined;
}

export function WiFiIndicator({ signalStrength }: WiFiIndicatorProps) {
  const strength = signalStrength || 'None';
  const strengthClass = getSignalStrengthClass(strength);
  
  return (
    <div className={styles['wifi-indicator-container']}>
      <div className={`${styles['wifi-signal-icon']} ${styles[strengthClass]}`}>
        <div className={`${styles['wifi-signal-bar']} ${styles['bar-1']}`}></div>
        <div className={`${styles['wifi-signal-bar']} ${styles['bar-2']}`}></div>
        <div className={`${styles['wifi-signal-bar']} ${styles['bar-3']}`}></div>
        <div className={`${styles['wifi-signal-bar']} ${styles['bar-4']}`}></div>
      </div>
      <span className={styles['wifi-text']}>{strength}</span>
    </div>
  );
}

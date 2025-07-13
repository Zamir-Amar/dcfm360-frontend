import { getSignalStrengthClass } from '../../hooks/useDevices';
import styles from '../../styles/components/wifi-indicator.module.css';

interface WiFiIndicatorProps {
  signalStrength: string | undefined;
  showLabel?: boolean;
}

export function WiFiIndicator({ signalStrength, showLabel = false }: WiFiIndicatorProps) {
  const strength = signalStrength || 'None';
  const strengthClass = getSignalStrengthClass(strength);
  
  return (
    <div className={styles['wifi-indicator-container']}>
      {showLabel && <span className={styles['wifi-label']}>WiFi Signal:</span>}
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

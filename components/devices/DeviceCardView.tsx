import { DeviceInfo, formatActivityTime } from '../../hooks/useDevices';
import { BatteryIndicator } from './BatteryIndicator';
import { WiFiIndicator } from './WiFiIndicator';
import styles from '../../styles/components/device-card-view.module.css';

interface DeviceCardViewProps {
  devices: DeviceInfo[];
}

export function DeviceCardView({ devices }: DeviceCardViewProps) {
  return (
    <div className={styles['device-card-container']}>
      {devices.map((device) => (
        <div key={device.deviceId} className={styles['device-card']}>
          <div className={styles['device-card-header']}>
            <h3 className={styles['device-card-title']}>{device.deviceId}</h3>
            <span className={`${styles['connection-state']} ${styles[device.connectionState.toLowerCase()]}`}>
              {device.connectionState}
            </span>
          </div>
          <div className={styles['device-card-body']}>
            <div className={styles['device-info']}>
              <span className={styles['device-label']}>Last Activity:</span>
              <span className={styles['device-value']}>{formatActivityTime(device.lastActivityTime)}</span>
            </div>
            <div className={styles['device-info']}>
              <span className={styles['device-label']}>WiFi Signal:</span>
              <WiFiIndicator signalStrength={device.properties?.reported.wifiSignalStrength} />
            </div>
            <div className={styles['device-info']}>
              <span className={styles['device-label']}>Battery Level:</span>
              <BatteryIndicator batteryLevel={device.properties?.reported.batteryLevel} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { DeviceInfo, formatActivityTime } from '../../hooks/useDevices';
import { BatteryIndicator } from './BatteryIndicator';
import { WiFiIndicator } from './WiFiIndicator';
import styles from '../../styles/components/device-card-view.module.css';
import { useRouter } from 'next/router';

interface DeviceCardViewProps {
  devices: DeviceInfo[];
}

export function DeviceCardView({ devices }: DeviceCardViewProps) {
  const router = useRouter();

  const handleDeviceClick = (deviceId: string) => {
    router.push(`/device/${deviceId}`);
  };

  return (
    <div className={styles['device-card-container']}>
      {devices.map((device) => (
        <div 
          key={device.deviceId} 
          className={`${styles['device-card']} ${styles[device.connectionState.toLowerCase()]}`}
          onClick={() => handleDeviceClick(device.deviceId)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles['device-card-header']}>
            <h3 className={styles['device-card-title']}>{device.deviceId}</h3>
          </div>
          <div className={styles['device-card-body']}>
            <div className={styles['device-info']}>
              <span className={styles['device-label']}>Last Activity:</span>
              <span className={styles['device-value']}>{formatActivityTime(device.lastActivityTime)}</span>
            </div>
            <div className={styles['device-info']}>
              <span className={styles['device-label']}>WiFi Signal:</span>
              <span className={styles['device-value-inline']}>
                <WiFiIndicator signalStrength={device.properties?.reported.wifiSignalStrength} />
              </span>
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

import { DeviceInfo, formatActivityTime } from '../../hooks/useDevices';
import { BatteryIndicator } from './BatteryIndicator';
import { WiFiIndicator } from './WiFiIndicator';
import styles from '../../styles/components/device-list-view.module.css';
import { useRouter } from 'next/router';

interface DeviceListViewProps {
  devices: DeviceInfo[];
}

export function DeviceListView({ devices }: DeviceListViewProps) {
  const router = useRouter();

  const handleDeviceClick = (deviceId: string) => {
    router.push(`/device/${deviceId}`);
  };

  return (
    <div className={styles['device-list-container']}>
      <table className={styles['device-table']}>
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Connection State</th>
            <th>Last Activity</th>
            <th>WiFi Signal Strength</th>
            <th>Battery Level</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              key={device.deviceId}
              onClick={() => handleDeviceClick(device.deviceId)}
              style={{ cursor: 'pointer' }}
              className={styles['device-row']}
            >
              <td>{device.deviceId}</td>
              <td>
                <span className={`${styles['connection-state']} ${styles[device.connectionState.toLowerCase()]}`}>
                  {device.connectionState}
                </span>
              </td>
              <td>{formatActivityTime(device.lastActivityTime)}</td>
              <td>
                <WiFiIndicator signalStrength={device.properties?.reported.wifiSignalStrength} />
              </td>
              <td>
                <BatteryIndicator batteryLevel={device.properties?.reported.batteryLevel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

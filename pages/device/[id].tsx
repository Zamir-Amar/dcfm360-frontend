import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeviceInfo, formatActivityTime } from '../../hooks/useDevices';
import { BatteryIndicator } from '../../components/devices/BatteryIndicator';
import { WiFiIndicator } from '../../components/devices/WiFiIndicator';
import styles from '../../styles/components/device-detail.module.css';

export default function DeviceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Wait until the router is ready and we have an id
    if (!router.isReady || !id) return;

    async function fetchDeviceDetails() {
      try {
        // Use the environment variable for the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/iot/devices/${id}/twin`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch device with ID: ${id}`);
        }
        
        const data = await response.json();
        setDevice(data);
        setError('');
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to fetch device details'}`);
      } finally {
        setLoading(false);
      }
    }

    fetchDeviceDetails();
    
    // Set up interval to refresh every 5 seconds
    const intervalId = setInterval(fetchDeviceDetails, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [router.isReady, id]);

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <p>Loading device details...</p>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className={styles['error-container']}>
        <p>{error || 'Device not found'}</p>
        <Link href="/devices">
          <span className={styles['back-button']}>Back to Devices</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Device: ${device.deviceId} - DCFM360`}</title>
        <meta name="description" content={`Details for IoT device ${device.deviceId}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles['device-detail-page']}>
        <div className={styles['device-detail-header']}>
          <Link href="/devices">
            <span className={styles['back-button']}>← Back to Devices</span>
          </Link>
          <h1 className={styles['device-detail-title']}>Device: {device.deviceId}</h1>
        </div>
        
        <div className={`${styles['device-detail-card']} ${styles[device.connectionState.toLowerCase()]}`}>
          <div className={styles['device-detail-section']}>
            <h2>Status Information</h2>
            <div className={styles['device-detail-info']}>
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Connection State:</span>
                <span className={`${styles['connection-state']} ${styles[device.connectionState.toLowerCase()]}`}>
                  {device.connectionState}
                </span>
              </div>
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Last Activity:</span>
                <span className={styles['info-value']}>{formatActivityTime(device.lastActivityTime)}</span>
              </div>
            </div>
          </div>
          
          <div className={styles['device-detail-section']}>
            <h2>Device Health</h2>
            <div className={styles['device-detail-info']}>
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>WiFi Signal:</span>
                <div className={styles['info-value-with-indicator']}>
                  <WiFiIndicator signalStrength={device.properties?.reported.wifiSignalStrength} />
                  <span>{device.properties?.reported.wifiSignalStrength || 'N/A'}</span>
                </div>
              </div>
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Battery Level:</span>
                <div className={styles['info-value-with-indicator']}>
                  <BatteryIndicator batteryLevel={device.properties?.reported.batteryLevel} />
                  <span>{device.properties?.reported.batteryLevel ? `${device.properties.reported.batteryLevel}%` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {device.properties && (
            <div className={styles['device-detail-section']}>
              <h2>Additional Properties</h2>
              <div className={styles['device-detail-json']}>
                <pre>{JSON.stringify(device.properties, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

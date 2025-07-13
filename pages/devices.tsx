import { useState, useEffect } from 'react';
import Head from 'next/head';

interface DeviceInfo {
  deviceId: string;
  connectionState: string;
  lastActivityTime: string;
  status?: string;
  wifiSignalStrength?: string; // WiFi signal strength as string values: None, Weak, Fair, Good, Excellent
  properties?: {
    reported: {
      wifiSignalStrength?: string;
      batteryLevel?: number;
    }
  };
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // Function to normalize the signal strength class name
  const getSignalStrengthClass = (signalStrength: string): string => {
    // Convert to lowercase for case-insensitive comparison and handle different formats
    const normalizedStrength = signalStrength.toLowerCase();
    if (normalizedStrength.includes('excellent')) return 'excellent';
    if (normalizedStrength.includes('good')) return 'good';
    if (normalizedStrength.includes('fair')) return 'fair';
    if (normalizedStrength.includes('weak')) return 'weak';
    if (normalizedStrength.includes('none')) return 'none';
    return 'none';
  };

  // Function to determine battery level class based on percentage
  const getBatteryLevelClass = (batteryLevel: number): string => {
    if (batteryLevel >= 80) return 'full';
    if (batteryLevel >= 60) return 'high';
    if (batteryLevel >= 40) return 'medium';
    if (batteryLevel >= 20) return 'low';
    return 'critical';
  };

  useEffect(() => {
    // Function to fetch devices
    async function fetchDevices() {
      try {
        // Use the environment variable for the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/iot/devices`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          // Ensure data is an array before setting it to the state
          setDevices(Array.isArray(data) ? data : []);
          setError('');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch devices. Make sure the backend is running.');
        setLoading(false);
      }
    }

    // Initial fetch
    fetchDevices();

    // Set up interval to refresh every 1 second
    const intervalId = setInterval(() => {
      fetchDevices();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  // Format the lastActivityTime to a more readable format
  const formatActivityTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <Head>
        <title>IoT Devices - DCFM360</title>
        <meta name="description" content="DCFM360 IoT Devices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="container">
          <h1>IoT Device Management</h1>
          <div className="device-table-container">
            <div className="header-controls">
              <h2>Connected Devices</h2>
              <div className="view-controls">
                <label htmlFor="view-mode">View Mode:</label>
                <select 
                  id="view-mode" 
                  value={viewMode} 
                  onChange={(e) => setViewMode(e.target.value as 'list' | 'card')}
                  className="view-mode-select"
                >
                  <option value="list">List View</option>
                  <option value="card">Card View</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p>Loading devices...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : !Array.isArray(devices) ? (
              <p>Invalid device data received.</p>
            ) : devices.length === 0 ? (
              <p>No devices found.</p>
            ) : viewMode === 'list' ? (
              <table className="device-table">
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
                    <tr key={device.deviceId}>
                      <td>{device.deviceId}</td>
                      <td>
                        <span className={`connection-state ${device.connectionState.toLowerCase()}`}>
                          {device.connectionState}
                        </span>
                      </td>
                      <td>{formatActivityTime(device.lastActivityTime)}</td>
                      <td>
                        {device.properties?.reported.wifiSignalStrength
                          ? <div className="wifi-indicator-container">
                              <div className={`wifi-signal-icon ${getSignalStrengthClass(device.properties.reported.wifiSignalStrength)}`}>
                                <div className="wifi-signal-bar bar-1"></div>
                                <div className="wifi-signal-bar bar-2"></div>
                                <div className="wifi-signal-bar bar-3"></div>
                                <div className="wifi-signal-bar bar-4"></div>
                              </div>
                              <span className="wifi-text">{device.properties.reported.wifiSignalStrength}</span>
                            </div>
                          : <span className="wifi-text">None</span>}
                      </td>
                      <td>
                        {device.properties?.reported.batteryLevel !== undefined
                          ? <div className="battery-indicator-container">
                              <div className={`battery-indicator ${getBatteryLevelClass(device.properties.reported.batteryLevel)}`}>
                                <div className="battery-body">
                                  <div 
                                    className="battery-level" 
                                    style={{width: `${Math.min(100, Math.max(0, device.properties?.reported.batteryLevel || 0))}%`}}
                                  ></div>
                                </div>
                                <div className="battery-cap"></div>
                              </div>
                              <span className="battery-text">{device.properties.reported.batteryLevel}%</span>
                            </div>
                          : <span className="battery-text">Unknown</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="device-card-container">
                {devices.map((device) => (
                  <div key={device.deviceId} className="device-card">
                    <div className="device-card-header">
                      <h3 className="device-card-title">{device.deviceId}</h3>
                      <span className={`connection-state ${device.connectionState.toLowerCase()}`}>
                        {device.connectionState}
                      </span>
                    </div>
                    <div className="device-card-body">
                      <div className="device-info">
                        <span className="device-label">Last Activity:</span>
                        <span className="device-value">{formatActivityTime(device.lastActivityTime)}</span>
                      </div>
                      <div className="device-info">
                        <span className="device-label">WiFi Signal:</span>
                        <div className="wifi-indicator-container">
                          <div className={`wifi-signal-icon ${getSignalStrengthClass(device.properties?.reported.wifiSignalStrength || '')}`}>
                            <div className="wifi-signal-bar bar-1"></div>
                            <div className="wifi-signal-bar bar-2"></div>
                            <div className="wifi-signal-bar bar-3"></div>
                            <div className="wifi-signal-bar bar-4"></div>
                          </div>
                          <span className="wifi-text">{device.properties?.reported.wifiSignalStrength || 'None'}</span>
                        </div>
                      </div>
                      <div className="device-info">
                        <span className="device-label">Battery Level:</span>
                        <div className="battery-indicator-container">
                          <div className={`battery-indicator ${getBatteryLevelClass(device.properties?.reported.batteryLevel || 0)}`}>
                            <div className="battery-body">
                              <div 
                                className="battery-level" 
                                style={{width: `${Math.min(100, Math.max(0, device.properties?.reported.batteryLevel || 0))}%`}}
                              ></div>
                            </div>
                            <div className="battery-cap"></div>
                          </div>
                          <span className="battery-text">{device.properties?.reported.batteryLevel !== undefined ? `${device.properties.reported.batteryLevel}%` : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: calc(100vh - 80px);
          padding: 1rem 2rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: 2rem;
        }

        .device-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .header-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .view-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        label {
          font-size: 0.9rem;
          color: #333;
        }

        .view-mode-select {
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: white;
          cursor: pointer;
        }

        .view-mode-select:focus {
          border-color: #0070f3;
          outline: none;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }

        .device-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .device-table th,
        .device-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .device-table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }

        .device-table tr:hover {
          background-color: #f8f9fa;
        }

        .connection-state {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        .connection-state.connected {
          background-color: #d4edda;
          color: #155724;
        }

        .connection-state.disconnected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .wifi-signal {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        .wifi-signal.excellent {
          background-color: #d4edda;
          color: #155724;
        }

        .wifi-signal.good {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .wifi-signal.fair {
          background-color: #fff3cd;
          color: #856404;
        }

        .wifi-signal.weak {
          background-color: #ffe0b2;
          color: #e65100;
        }

        .wifi-signal.poor {
          background-color: #f8d7da;
          color: #721c24;
        }

        .error {
          color: #dc3545;
        }

        .refresh-info {
          text-align: right;
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.5rem;
        }

        .wifi-indicator-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wifi-text {
          font-size: 0.9rem;
          margin-left: 8px;
        }
        
        .wifi-signal-icon {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 20px;
          height: 16px;
        }
        
        .wifi-signal-bar {
          width: 3px;
          background-color: #ddd;
          margin: 0 1px;
          border-radius: 2px;
          opacity: 0.3;
        }
        
        .bar-1 {
          height: 4px;
        }
        
        .bar-2 {
          height: 8px;
        }
        
        .bar-3 {
          height: 12px;
        }
        
        .bar-4 {
          height: 16px;
        }
        
        /* Signal strength-based styling */
        .wifi-signal-icon.excellent .wifi-signal-bar {
          background-color: #28a745;
          opacity: 1;
        }
        
        .wifi-signal-icon.good .wifi-signal-bar.bar-1,
        .wifi-signal-icon.good .wifi-signal-bar.bar-2,
        .wifi-signal-icon.good .wifi-signal-bar.bar-3 {
          background-color: #17a2b8;
          opacity: 1;
        }
        
        .wifi-signal-icon.fair .wifi-signal-bar.bar-1,
        .wifi-signal-icon.fair .wifi-signal-bar.bar-2 {
          background-color: #ffc107;
          opacity: 1;
        }
        
        .wifi-signal-icon.weak .wifi-signal-bar.bar-1 {
          background-color: #fd7e14;
          opacity: 1;
        }
        
        .wifi-signal-icon.none .wifi-signal-bar {
          background-color: #dc3545;
          opacity: 0.3;
        }

        /* Battery indicator styles */
        .battery-indicator-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .battery-text {
          font-size: 0.9rem;
          margin-left: 5px;
        }

        .battery-indicator {
          position: relative;
          width: 30px;
          height: 16px;
          display: inline-flex;
          align-items: center;
        }

        .battery-body {
          width: 24px;
          height: 12px;
          border: 2px solid #ddd;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .battery-cap {
          width: 2px;
          height: 6px;
          background-color: #ddd;
          margin-left: 1px;
          border-radius: 0 2px 2px 0;
        }

        .battery-level {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #ddd;
          transition: width 0.3s ease;
        }

        /* Battery level-based styling */
        .battery-indicator.full .battery-body {
          border-color: #28a745;
        }
        .battery-indicator.full .battery-level {
          background-color: #28a745;
        }
        .battery-indicator.full .battery-cap {
          background-color: #28a745;
        }

        .battery-indicator.high .battery-body {
          border-color: #17a2b8;
        }
        .battery-indicator.high .battery-level {
          background-color: #17a2b8;
        }
        .battery-indicator.high .battery-cap {
          background-color: #17a2b8;
        }

        .battery-indicator.medium .battery-body {
          border-color: #ffc107;
        }
        .battery-indicator.medium .battery-level {
          background-color: #ffc107;
        }
        .battery-indicator.medium .battery-cap {
          background-color: #ffc107;
        }

        .battery-indicator.low .battery-body {
          border-color: #fd7e14;
        }
        .battery-indicator.low .battery-level {
          background-color: #fd7e14;
        }
        .battery-indicator.low .battery-cap {
          background-color: #fd7e14;
        }

        .battery-indicator.critical .battery-body {
          border-color: #dc3545;
        }
        .battery-indicator.critical .battery-level {
          background-color: #dc3545;
        }
        .battery-indicator.critical .battery-cap {
          background-color: #dc3545;
        }

        .device-card-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .device-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          transition: transform 0.3s;
        }

        .device-card:hover {
          transform: translateY(-2px);
        }

        .device-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .device-card-title {
          font-size: 1.1rem;
          margin: 0;
        }

        .device-card-body {
          font-size: 0.9rem;
        }

        .device-info {
          margin-bottom: 0.5rem;
        }

        .device-label {
          font-weight: 500;
          color: #333;
        }

        .device-value {
          margin-left: 0.5rem;
          color: #666;
        }
      `}</style>
    </>
  );
}

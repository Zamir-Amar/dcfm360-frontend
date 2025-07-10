import { useState, useEffect } from 'react';
import Head from 'next/head';

interface DeviceInfo {
  deviceId: string;
  connectionState: string;
  lastActivityTime: string;
  status?: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setDevices(data);
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

    // Set up interval to refresh every 3 seconds
    const intervalId = setInterval(() => {
      fetchDevices();
    }, 3000);

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
            <h2>Connected Devices</h2>
            {loading ? (
              <p>Loading devices...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : devices.length === 0 ? (
              <p>No devices found.</p>
            ) : (
              <table className="device-table">
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Connection State</th>
                    <th>Last Activity</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="refresh-info">
              <p>Auto-refreshes every 3 seconds</p>
            </div>
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

        .error {
          color: #dc3545;
        }

        .refresh-info {
          text-align: right;
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  deviceId: string;
  connectionState: string;
  lastActivityTime: string;
  status?: string;
  wifiSignalStrength?: string;
  properties?: {
    reported: {
      wifiSignalStrength?: string;
      batteryLevel?: number;
    }
  };
}

export function useDevices() {
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

    // Set up interval to refresh every 5 seconds
    const intervalId = setInterval(() => {
      fetchDevices();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return { devices, loading, error };
}

// Utility functions for device data
export const formatActivityTime = (timestamp: string) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const getSignalStrengthClass = (signalStrength: string): string => {
  // Convert to lowercase for case-insensitive comparison and handle different formats
  const normalizedStrength = signalStrength?.toLowerCase() || '';
  if (normalizedStrength.includes('excellent')) return 'excellent';
  if (normalizedStrength.includes('good')) return 'good';
  if (normalizedStrength.includes('fair')) return 'fair';
  if (normalizedStrength.includes('weak')) return 'weak';
  return 'none';
};

export const getBatteryLevelClass = (batteryLevel: number): string => {
  if (batteryLevel >= 80) return 'full';
  if (batteryLevel >= 60) return 'high';
  if (batteryLevel >= 40) return 'medium';
  if (batteryLevel >= 20) return 'low';
  return 'critical';
};

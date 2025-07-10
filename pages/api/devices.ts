import type { NextApiRequest, NextApiResponse } from 'next';

type DeviceResponse = {
  devices: DeviceInfo[];
  error?: string;
};

interface DeviceInfo {
  deviceId: string;
  connectionState: string;
  lastActivityTime: string;
  status?: string;
  statusReason?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeviceResponse>
) {
  try {
    // Get the backend URL from environment variables or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Call the backend devices endpoint
    const response = await fetch(`${backendUrl}/iot/devices`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const devices = await response.json();
    
    res.status(200).json({
      devices
    });
  } catch (error) {
    console.error('Error fetching devices from backend:', error);
    res.status(500).json({
      devices: [],
      error: 'Failed to fetch devices from backend service'
    });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  message: string;
  timestamp: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  try {
    // Get the backend URL from environment variables or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/iot-status';
    
    // Call the backend health endpoint
    const response = await fetch(`${backendUrl}/`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    res.status(200).json({
      message: data.message || 'Backend is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error connecting to backend:', error);
    res.status(500).json({
      message: 'Failed to connect to backend service',
      timestamp: new Date().toISOString()
    });
  }
}

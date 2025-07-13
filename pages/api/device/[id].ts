import type { NextApiRequest, NextApiResponse } from 'next';

type DeviceResponse = {
  device?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeviceResponse>
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid device ID' });
  }

  try {
    // Get the backend URL from environment variables or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Call the backend device endpoint with the specific ID
    const response = await fetch(`${backendUrl}/iot/devices/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: `Device with ID ${id} not found` });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const device = await response.json();
    
    res.status(200).json({
      device
    });
  } catch (error) {
    console.error(`Error fetching device ${id} from backend:`, error);
    res.status(500).json({
      error: `Failed to fetch device ${id} from backend service`
    });
  }
}

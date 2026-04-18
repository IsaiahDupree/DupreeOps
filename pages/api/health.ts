import type { NextApiRequest, NextApiResponse } from 'next'
import { applyCors, handleCorsPreFlight } from '@/lib/api-utils'

interface HealthResponse {
  status: 'healthy'
  timestamp: string
  service: string
  version: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Handle CORS preflight
  if (handleCorsPreFlight(req, res)) {
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    applyCors(res)
    return res.status(405).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'dupreeops-website',
      version: '1.0.0',
    })
  }

  applyCors(res)
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'dupreeops-website',
    version: '1.0.0',
  })
}

import type { NextApiRequest, NextApiResponse } from 'next'

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
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'dupreeops-website',
    version: '1.0.0',
  })
}

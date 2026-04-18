import type { NextApiRequest, NextApiResponse } from 'next'

export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
  status: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data?: T
  message?: string
}

// CORS headers configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Apply CORS headers to response
export function applyCors(res: NextApiResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })
}

// Handle preflight requests
export function handleCorsPreFlight(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    applyCors(res)
    res.status(200).end()
    return true
  }
  return false
}

// Standardized error response
export function sendError(
  res: NextApiResponse,
  statusCode: number,
  message: string,
  error?: unknown
) {
  applyCors(res)

  if (process.env.NODE_ENV === 'development' && error) {
    console.error(`[API Error ${statusCode}]`, error)
  }

  res.status(statusCode).json({
    success: false,
    message,
    status: statusCode,
  } as ApiErrorResponse)
}

// Standardized success response
export function sendSuccess<T>(
  res: NextApiResponse,
  data?: T,
  message?: string
) {
  applyCors(res)
  res.status(200).json({
    success: true,
    data,
    message,
  } as ApiSuccessResponse<T>)
}

// Common error handlers
export const ApiErrors = {
  BadRequest: (message: string) => ({ statusCode: 400, message }),
  Unauthorized: (message: string = 'Unauthorized') => ({ statusCode: 401, message }),
  Forbidden: (message: string = 'Forbidden') => ({ statusCode: 403, message }),
  NotFound: (message: string = 'Not found') => ({ statusCode: 404, message }),
  MethodNotAllowed: (message: string = 'Method not allowed') => ({ statusCode: 405, message }),
  Conflict: (message: string) => ({ statusCode: 409, message }),
  TooManyRequests: (message: string = 'Too many requests') => ({ statusCode: 429, message }),
  ServerError: (message: string = 'Internal server error') => ({ statusCode: 500, message }),
  ServiceUnavailable: (message: string = 'Service unavailable') => ({ statusCode: 503, message }),
}

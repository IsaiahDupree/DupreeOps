import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/lib/supabase'
import { validateContactForm, type ContactFormData } from '@/lib/validation'
import { sendError, sendSuccess, handleCorsPreFlight, ApiErrors } from '@/lib/api-utils'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendLeadNotification } from '@/lib/email'

interface ContactResponse {
  success: boolean
  message: string
  id?: string
  errors?: Array<{ field: string; message: string }>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  // Handle CORS preflight
  if (handleCorsPreFlight(req, res)) {
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    const { statusCode, message } = ApiErrors.MethodNotAllowed()
    return sendError(res, statusCode, message)
  }

  // Check rate limit
  const clientIp = getClientIp(req.headers as Record<string, string | string[]>)
  const rateLimit = checkRateLimit(clientIp, 'contact')

  if (!rateLimit.allowed) {
    const { statusCode, message } = ApiErrors.TooManyRequests(
      'Too many requests. Please try again later.'
    )
    res.setHeader('Retry-After', Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
    return sendError(res, statusCode, message)
  }

  try {
    const { name, email, message } = req.body

    // Validate input
    const formData: Partial<ContactFormData> = { name, email, message }
    const validationErrors = validateContactForm(formData)

    if (validationErrors.length > 0) {
      const { statusCode, message: errorMsg } = ApiErrors.BadRequest('Validation failed')
      return res.status(statusCode).json({
        success: false,
        message: errorMsg,
        errors: validationErrors,
      })
    }

    // Create server client and insert into database
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      const { statusCode, message: errorMsg } = ApiErrors.ServerError()
      return sendError(res, statusCode, 'Failed to save submission. Please try again later.', error)
    }

    // Best-effort lead notification. The Supabase row above is the source of truth;
    // an email failure must NOT fail the submission, so we never throw from here.
    const emailResult = await sendLeadNotification({
      name,
      email,
      message,
      submissionId: data?.id,
    })
    if (!emailResult.sent) {
      console.error('Lead notification email not sent:', emailResult.error)
    }

    return sendSuccess(res, { id: data?.id }, 'Contact form submitted successfully')
  } catch (error) {
    console.error('Contact API error:', error)
    const { statusCode, message: errorMsg } = ApiErrors.ServerError()
    return sendError(res, statusCode, 'An unexpected error occurred. Please try again later.', error)
  }
}

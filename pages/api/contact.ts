import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/lib/supabase'
import { validateContactForm, type ContactFormData } from '@/lib/validation'

interface SuccessResponse {
  success: true
  message: string
  id?: string
}

interface ErrorResponse {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
}

type Response = SuccessResponse | ErrorResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { name, email, message } = req.body

    // Validate input
    const formData: Partial<ContactFormData> = { name, email, message }
    const validationErrors = validateContactForm(formData)

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      return res.status(500).json({
        success: false,
        message: 'Failed to save submission. Please try again later.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: data?.id,
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    })
  }
}

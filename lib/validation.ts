export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ValidationError {
  field: string
  message: string
}

export function validateContactForm(data: Partial<ContactFormData>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
  } else if (data.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' })
  }

  if (!data.email || data.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' })
  }

  if (!data.message || data.message.trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' })
  } else if (data.message.length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  } else if (data.message.length > 5000) {
    errors.push({ field: 'message', message: 'Message must be less than 5000 characters' })
  }

  return errors
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

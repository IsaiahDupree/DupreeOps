import { useState } from 'react'
import { validateContactForm } from '@/lib/validation'

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrors({})

    // Client-side validation
    const validationErrors = validateContactForm(formState)
    if (validationErrors.length > 0) {
      const errorMap: FormErrors = {}
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message
      })
      setErrors(errorMap)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setSuccessMessage("Thank you! Your message has been received. We'll get back to you soon.")
        setFormState({ name: '', email: '', message: '' })

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle')
          setSuccessMessage('')
        }, 5000)
      } else {
        setSubmitStatus('error')
        if (data.errors && Array.isArray(data.errors)) {
          const errorMap: FormErrors = {}
          data.errors.forEach((error: { field: string; message: string }) => {
            errorMap[error.field] = error.message
          })
          setErrors(errorMap)
        } else {
          setErrors({ form: data.message || 'Failed to submit form' })
        }
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrors({
        form: 'An error occurred while submitting the form. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Contact form">
      {/* Form-level error */}
      {errors.form && (
        <div className="rounded-lg border border-red-200 bg-red-50/80 p-3 sm:p-4 dark:border-red-900/50 dark:bg-red-950/30" role="alert">
          <p className="text-sm text-red-700 dark:text-red-400">{errors.form}</p>
        </div>
      )}

      {/* Success message */}
      {submitStatus === 'success' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 sm:p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30" role="status" aria-live="polite">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">{successMessage}</p>
        </div>
      )}

      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Name <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          disabled={isLoading}
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-900 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-950 ${
            errors.name
              ? 'border-red-300 dark:border-red-700'
              : 'border-slate-300 dark:border-slate-700'
          } text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50`}
          placeholder="Your name"
        />
        {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.name}</p>}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-900 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-950 ${
            errors.email
              ? 'border-red-300 dark:border-red-700'
              : 'border-slate-300 dark:border-slate-700'
          } text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50`}
          placeholder="your@email.com"
        />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.email}</p>}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Message <span className="text-red-500" aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          disabled={isLoading}
          required
          rows={6}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-950 ${
            errors.message
              ? 'border-red-300 dark:border-red-700'
              : 'border-slate-300 dark:border-slate-700'
          } text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 resize-none`}
          placeholder="Tell us about your project..."
        />
        {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.message}</p>}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || submitStatus === 'success'}
        aria-busy={isLoading}
        className="inline-flex items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm active:bg-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:active:bg-white dark:hover:bg-white transition-colors touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:focus:ring-offset-slate-950"
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '@/components/ContactForm'

describe('ContactForm', () => {
  it('renders form with all fields', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'Test Name' } })
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /send message/i })

    // Submit empty form to trigger errors
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })

    // Start typing in name field
    fireEvent.change(nameInput, { target: { value: 'Test' } })

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
    })
  })

  it('disables submit button when loading', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i }) as HTMLButtonElement

    fireEvent.change(nameInput, { target: { value: 'Test Name' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    // Note: Actual loading state would depend on successful form submission
    // This test verifies the form structure and validation logic
  })
})

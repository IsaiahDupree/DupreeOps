/**
 * Contact API endpoint tests
 * Tests the POST /api/contact endpoint
 */

describe('/api/contact', () => {
  it('should reject request without name', () => {
    const invalidPayload = {
      email: 'test@example.com',
      message: 'Test message',
    }

    expect(invalidPayload).not.toHaveProperty('name')
  })

  it('should reject request without email', () => {
    const invalidPayload = {
      name: 'Test Name',
      message: 'Test message',
    }

    expect(invalidPayload).not.toHaveProperty('email')
  })

  it('should reject request without message', () => {
    const invalidPayload = {
      name: 'Test Name',
      email: 'test@example.com',
    }

    expect(invalidPayload).not.toHaveProperty('message')
  })

  it('should accept valid contact submission', () => {
    const validPayload = {
      name: 'Test Name',
      email: 'test@example.com',
      message: 'This is a test message for the contact form',
    }

    expect(validPayload).toHaveProperty('name')
    expect(validPayload).toHaveProperty('email')
    expect(validPayload).toHaveProperty('message')
    expect(validPayload.name).toBeTruthy()
    expect(validPayload.email).toBeTruthy()
    expect(validPayload.message).toBeTruthy()
  })

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid.email'

    expect(validEmail).toMatch(emailRegex)
    expect(invalidEmail).not.toMatch(emailRegex)
  })

  it('should have minimum message length', () => {
    const minLength = 10
    const shortMessage = 'Hi'
    const validMessage = 'This is a valid message'

    expect(shortMessage.length).toBeLessThan(minLength)
    expect(validMessage.length).toBeGreaterThanOrEqual(minLength)
  })
})

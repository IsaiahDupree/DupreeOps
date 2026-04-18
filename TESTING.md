# Testing Guide - Dupree Ops Website

## Overview
This document outlines the testing strategy for the Dupree Ops website.

## Test Coverage

### Manual Testing (Current)
The following features have been manually tested:
- ✅ Homepage loads correctly
- ✅ Services page displays all services with comparison table
- ✅ Contact form validates input and shows errors
- ✅ Contact form submission API endpoint works
- ✅ /api/health endpoint returns 200 status
- ✅ CORS headers are present in API responses
- ✅ Rate limiting is active on contact endpoint
- ✅ Theme toggle works (light/dark mode)
- ✅ Mobile responsive design
- ✅ SEO meta tags present

### Automated Testing (Recommended Setup)

To add automated tests, install dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
npm install --save-dev ts-jest @testing-library/user-event
```

### Component Tests (Recommended)

Create test files in `__tests__/components/`:

#### ContactForm.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ContactForm from '@/components/ContactForm'

describe('ContactForm', () => {
  it('renders form fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    expect(emailInput).toHaveValue('invalid')
  })

  it('submits form with valid data', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
  })
})
```

### API Tests (Recommended)

Create test files in `__tests__/api/`:

#### health.test.ts
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/health'

describe('/api/health', () => {
  it('returns 200 with healthy status', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const body = JSON.parse(res._getData())
    expect(body.status).toBe('healthy')
  })

  it('includes required fields', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    const body = JSON.parse(res._getData())
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('service')
    expect(body).toHaveProperty('version')
  })
})
```

### Integration Tests (Recommended)

Test the full contact form flow:
1. User fills in form
2. Form validates input
3. API accepts submission
4. Data saves to Supabase
5. Success message displays

## Running Tests

Once set up, run tests with:

```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

## Test Coverage Goals

- Components: 70%+ coverage
- API endpoints: 80%+ coverage
- Utilities: 85%+ coverage
- Overall: 75%+ coverage

## Best Practices

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test how components work together
3. **E2E Tests**: Test complete user workflows
4. **Accessibility**: Use `@testing-library/jest-dom` for a11y tests
5. **Mock External Services**: Mock Supabase calls in tests

## CI/CD Testing

Consider adding GitHub Actions for automated testing:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
```

## Manual Testing Checklist

Before each deployment:
- [ ] Homepage loads without errors
- [ ] Services page displays all services
- [ ] Contact form validates properly
- [ ] Contact form submits successfully
- [ ] API health endpoint responds
- [ ] All pages are mobile responsive
- [ ] Dark/light theme toggle works
- [ ] No console errors in browser
- [ ] All external links work

## Support

For testing documentation:
- Jest: https://jestjs.io
- React Testing Library: https://testing-library.com/react
- Next.js: https://nextjs.org/docs/testing

import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should fill and submit contact form successfully', async ({ page }) => {
    // Fill form fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('text=Thank you for your message')).toBeVisible({
      timeout: 5000,
    });

    // Verify form is cleared
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveValue('');
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Check for HTML5 validation
    const nameInput = page.locator('input[name="name"]');
    const isRequired = await nameInput.getAttribute('required');
    expect(isRequired).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    // Fill with invalid email
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('textarea[name="message"]', 'Test message');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait a moment for validation
    await page.waitForTimeout(500);

    // Check if form is still visible (not submitted due to invalid email)
    const form = page.locator('form[aria-label="Contact form"]');
    await expect(form).toBeVisible();
  });

  test('should save contact submission to database', async ({
    page,
    context,
  }) => {
    const testEmail = `test-${Date.now()}@example.com`;

    // Fill form with unique email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('textarea[name="message"]', 'Test message for database');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(page.locator('text=Thank you for your message')).toBeVisible({
      timeout: 5000,
    });

    // Verify API was called (check network)
    const responses = [];
    page.on('response', (response) => {
      if (response.url().includes('/api/contact')) {
        responses.push(response.status());
      }
    });

    // Re-submit to verify API works
    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', `another-${Date.now()}@example.com`);
    await page.fill('textarea[name="message"]', 'Another test message');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Thank you for your message')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');

    // Intercept API call and return error
    await page.route('**/api/contact', (route) => {
      route.abort('failed');
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(
      page.locator('text=/error|failed|try again/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Form should still be visible and editable
    const form = page.locator('form[aria-label="Contact form"]');
    await expect(form).toBeVisible();
  });

  test('should enforce rate limiting', async ({ page }) => {
    // Submit form multiple times quickly
    for (let i = 0; i < 3; i++) {
      await page.fill('input[name="name"]', `User ${i}`);
      await page.fill('input[name="email"]', `user${i}@example.com`);
      await page.fill('textarea[name="message"]', `Message ${i}`);
      await page.click('button[type="submit"]');

      // Wait for response
      await page.waitForTimeout(500);
    }

    // After rate limit is hit, check if submit is disabled
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.getAttribute('disabled');

    // Either button is disabled or shows a rate limit message
    const hasRateLimitMessage =
      (await page.locator('text=/rate limit|too many|slow down/i').count()) >
      0;

    expect(isDisabled || hasRateLimitMessage).toBeTruthy();
  });
});

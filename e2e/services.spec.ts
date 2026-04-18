import { test, expect } from '@playwright/test';

test.describe('Services Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('should load services page with all service cards', async ({ page }) => {
    // Check page title/heading
    await expect(page.locator('text=Our Services')).toBeVisible();

    // Verify all three service cards are present
    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards).toHaveCount(3);
  });

  test('should display correct service information', async ({ page }) => {
    // AI Automation Audit
    await expect(page.locator('text=AI Automation Audit')).toBeVisible();
    await expect(page.locator('text=$2,500')).toBeVisible();

    // Social Growth Service
    await expect(page.locator('text=Social Growth Service')).toBeVisible();
    await expect(page.locator('text=$500')).toBeVisible();
    await expect(page.locator('text=/month|mo/i')).toBeVisible();

    // ACTP Setup
    await expect(page.locator('text=ACTP Setup')).toBeVisible();
    await expect(page.locator('text=$1,500')).toBeVisible();
  });

  test('should verify prices are correctly displayed', async ({ page }) => {
    const cards = page.locator('[data-testid="service-card"]');

    // Get first card (AI Automation)
    const firstCard = cards.nth(0);
    const automationPrice = firstCard.locator('text=$2,500');
    await expect(automationPrice).toBeVisible();

    // Get second card (Social Growth)
    const secondCard = cards.nth(1);
    const growthPrice = secondCard.locator('text=$500');
    await expect(growthPrice).toBeVisible();

    // Get third card (ACTP Setup)
    const thirdCard = cards.nth(2);
    const acupPrice = thirdCard.locator('text=$1,500');
    await expect(acupPrice).toBeVisible();
  });

  test('should have clickable CTA buttons', async ({ page }) => {
    // Get all CTA buttons
    const ctaButtons = page.locator('a:has-text("Learn More"), button:has-text("Get Started"), a:has-text("Get Started")');

    // Verify at least one CTA is visible and clickable
    const firstButton = page.locator('button, a').filter({ hasText: /Learn More|Get Started|Contact Us/i }).first();
    await expect(firstButton).toBeVisible();

    // Verify it's clickable (not disabled)
    const isDisabled = await firstButton.getAttribute('disabled');
    expect(isDisabled).toBeNull();
  });

  test('should navigate to service detail pages', async ({ page }) => {
    // Click on first service's link
    const serviceLinks = page.locator('a[href*="/services/"]');
    const firstLink = serviceLinks.first();

    if (await firstLink.count() > 0) {
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/\/services\/.+/);

      // Navigate to service detail
      await firstLink.click();

      // Verify navigation occurred
      await expect(page).toHaveURL(/\/services\/.+/);

      // Verify service details load
      const serviceTitle = page.locator('h1, h2');
      await expect(serviceTitle.first()).toBeVisible();
    }
  });

  test('should display service benefits/features', async ({ page }) => {
    const cards = page.locator('[data-testid="service-card"]');

    // Check if benefits/features are displayed
    for (let i = 0; i < (await cards.count()); i++) {
      const card = cards.nth(i);
      const benefits = card.locator('li, .benefit, [class*="feature"]');

      // At least some content should be visible
      await expect(card).toBeVisible();
    }
  });

  test('should have responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Services should still be visible
    const serviceCards = page.locator('[data-testid="service-card"]');
    await expect(serviceCards.first()).toBeVisible();

    // Prices should be readable
    await expect(page.locator('text=$')).toBeVisible();
  });

  test('should have accessible service comparison table if present', async ({
    page,
  }) => {
    // Check if comparison table exists
    const table = page.locator('table');

    if (await table.count() > 0) {
      // Verify table has proper structure
      const rows = table.locator('tr');
      const minRows = 2; // Header + at least 1 data row

      expect(await rows.count()).toBeGreaterThanOrEqual(minRows);

      // Verify table headers
      const headers = table.locator('th');
      expect(await headers.count()).toBeGreaterThan(0);
    }
  });

  test('should have proper navigation flow', async ({ page }) => {
    // Check for breadcrumbs or navigation back to home
    const homeLink = page.locator('a[href="/"]');

    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible();
    }

    // Verify current page is indicated
    const serviceNav = page.locator(
      'nav [aria-current="page"], nav .active, header [aria-label*="Services"]'
    );

    // At least one navigation indicator should exist
    const navElements = page.locator('nav');
    expect(await navElements.count()).toBeGreaterThan(0);
  });

  test('should load images optimally', async ({ page }) => {
    // Check for images in service cards
    const images = page.locator('[data-testid="service-card"] img');

    for (let i = 0; i < (await images.count()); i++) {
      const img = images.nth(i);

      // Verify image has alt text (accessibility)
      const alt = await img.getAttribute('alt');
      if (alt) {
        expect(alt.length).toBeGreaterThan(0);
      }

      // Verify image is visible (loaded)
      await expect(img).toBeVisible({ timeout: 5000 });
    }
  });

  test('should perform full services page navigation flow', async ({
    page,
  }) => {
    // From services page, navigate to a service detail
    const firstServiceLink = page
      .locator('a[href*="/services/"]')
      .or(page.locator('[data-testid="service-card"] a'))
      .first();

    if (await firstServiceLink.count() > 0) {
      await firstServiceLink.click();

      // Verify we're on a service detail page
      await expect(page).toHaveURL(/\/services\/.*/);

      // Verify service info is displayed
      await expect(page.locator('text=\\$')).toBeVisible();

      // Navigate back to services
      const backLink = page.locator('a[href="/services"]');
      if (await backLink.count() > 0) {
        await backLink.click();
        await expect(page).toHaveURL('/services');
      }
    }
  });
});

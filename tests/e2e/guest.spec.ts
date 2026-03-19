/**
 * Guest Flows (A)
 *
 * Tests that cover how the app behaves for unauthenticated visitors.
 * No storageState is applied – these run as a plain guest.
 */

import { test, expect } from '@playwright/test';

// Guest tests run without any stored auth state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Guest – Homepage', () => {
  test('homepage loads and shows the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Arkanum/i);
    // Hero / main landing content is visible
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('guest navigation is visible (Anmelden + Kostenlos starten)', async ({ page }) => {
    await page.goto('/');
    // Login link in navbar (desktop)
    const loginLink = page.locator('[data-testid="nav-login-link"]');
    await expect(loginLink).toBeVisible();
    // Start CTA in navbar
    const startLink = page.locator('[data-testid="nav-start-link"]');
    await expect(startLink).toBeVisible();
  });

  test('guest nav links point to /login', async ({ page }) => {
    await page.goto('/');
    const loginHref = await page.locator('[data-testid="nav-login-link"]').getAttribute('href');
    expect(loginHref).toBe('/login');

    const startHref = await page.locator('[data-testid="nav-start-link"]').getAttribute('href');
    expect(startHref).toBe('/login');
  });

  test('authenticated nav elements are not visible to guests', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="nav-logout"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="nav-dashboard-link"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="nav-admin-link"]')).not.toBeVisible();
  });
});

test.describe('Guest – Protected routes redirect to login', () => {
  const protectedPaths = [
    '/dashboard',
    '/meine-kurse',
    '/lernfortschritt',
    '/ki-assistent',
    '/profil',
    '/einstellungen',
    '/abo',
    '/admin',
  ];

  for (const path of protectedPaths) {
    test(`${path} redirects unauthenticated user to /login`, async ({ page }) => {
      await page.goto(path);
      await page.waitForURL(/\/login/, { timeout: 10_000 });
      expect(page.url()).toContain('/login');
    });
  }
});

test.describe('Guest – Public pages are accessible', () => {
  test('courses list page is accessible', async ({ page }) => {
    const response = await page.goto('/kurse');
    expect(response?.status()).toBeLessThan(400);
  });

  test('pricing page is accessible', async ({ page }) => {
    const response = await page.goto('/preise');
    expect(response?.status()).toBeLessThan(400);
  });

  test('about page is accessible', async ({ page }) => {
    const response = await page.goto('/ueber-uns');
    expect(response?.status()).toBeLessThan(400);
  });
});

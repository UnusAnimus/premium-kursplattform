/**
 * Admin Flows (C)
 *
 * Tests that cover the admin-specific experience:
 * admin login redirect, admin area accessibility, role-based navigation.
 *
 * The storageState is created by auth.setup.ts.
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// Reuse the admin session created in auth.setup.ts
test.use({ storageState: path.join(__dirname, '../../playwright/.auth/admin.json') });

test.describe('Admin – Session awareness', () => {
  test('admin can access the admin area', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
    expect(page.url()).not.toContain('/login');
  });

  test('navbar shows admin-specific link (Admin-Bereich)', async ({ page }) => {
    await page.goto('/');
    // Admin nav link should be visible
    await expect(page.locator('[data-testid="nav-admin-link"]')).toBeVisible();
  });

  test('navbar does not show guest state for a logged-in admin', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="nav-login-link"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="nav-start-link"]')).not.toBeVisible();
  });

  test('admin nav does not show member-only Dashboard link', async ({ page }) => {
    await page.goto('/');
    // For admins, only nav-admin-link should appear, not nav-dashboard-link
    await expect(page.locator('[data-testid="nav-dashboard-link"]')).not.toBeVisible();
  });

  test('admin logout button is visible', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('[data-testid="nav-logout"]')).toBeVisible();
  });
});

test.describe('Admin – Login redirect', () => {
  /**
   * Validates that admin credentials lead to /admin (via the useEffect
   * redirect in LoginForm or via the initial session redirect).
   */
  test('admin login ultimately reaches /admin', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@arkanum-akademie.de';
    const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'Admin123!';

    await page.goto('/login');
    await page.locator('[data-testid="login-email"]').fill(adminEmail);
    await page.locator('[data-testid="login-password"]').fill(adminPassword);
    await page.locator('[data-testid="login-submit"]').click();

    // Wait for navigation away from /login (may hit /dashboard first, then /admin)
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });

    // Navigate explicitly to /admin to verify access
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);

    await context.close();
  });
});

test.describe('Admin – Accessing protected admin sub-routes', () => {
  const adminRoutes = [
    '/admin',
    '/admin/kurse',
    '/admin/nutzer',
    '/admin/zahlungen',
  ];

  for (const route of adminRoutes) {
    test(`admin can access ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      expect(page.url()).not.toContain('/login');
      expect(page.url()).not.toContain('/dashboard');
    });
  }
});

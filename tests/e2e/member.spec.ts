/**
 * Member Flows (B)
 *
 * Tests that cover the full lifecycle of a logged-in member:
 * login → dashboard → protected pages → logout.
 *
 * The storageState is created by auth.setup.ts; this file reuses it
 * so the actual login UI is only exercised once (in setup) plus once
 * explicitly below to validate the login redirect.
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// Reuse the member session created in auth.setup.ts
test.use({ storageState: path.join(__dirname, '../../playwright/.auth/member.json') });

test.describe('Member – Session awareness', () => {
  test('dashboard is accessible after login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    // Should not be redirected to login
    expect(page.url()).not.toContain('/login');
  });

  test('navbar does not show guest state for a logged-in member', async ({ page }) => {
    await page.goto('/dashboard');
    // Guest links must not be visible
    await expect(page.locator('[data-testid="nav-login-link"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="nav-start-link"]')).not.toBeVisible();
  });

  test('navbar shows member-specific links (Dashboard + Abmelden)', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="nav-dashboard-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-logout"]')).toBeVisible();
  });

  test('member can access their courses page', async ({ page }) => {
    await page.goto('/meine-kurse');
    await expect(page).toHaveURL(/\/meine-kurse/);
    expect(page.url()).not.toContain('/login');
  });

  test('member can access profile page', async ({ page }) => {
    await page.goto('/profil');
    await expect(page).toHaveURL(/\/profil/);
    expect(page.url()).not.toContain('/login');
  });

  test('member cannot access admin area (redirected to /dashboard)', async ({ page }) => {
    await page.goto('/admin');
    // Middleware redirects non-admins from /admin to /dashboard
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 10_000 });
    expect(page.url()).not.toContain('/admin');
  });

  test('admin-specific nav link is not shown for a member', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="nav-admin-link"]')).not.toBeVisible();
  });
});

test.describe('Member – Login redirect', () => {
  /**
   * This test validates the login flow for members explicitly,
   * using a fresh context (no stored session) to simulate a
   * new login from scratch.
   */
  test('member login redirects to /dashboard', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    const memberEmail = process.env.E2E_MEMBER_EMAIL ?? 'mitglied@arkanum-akademie.de';
    const memberPassword = process.env.E2E_MEMBER_PASSWORD ?? 'Member123!';

    await page.goto('/login');
    await page.locator('[data-testid="login-email"]').fill(memberEmail);
    await page.locator('[data-testid="login-password"]').fill(memberPassword);
    await page.locator('[data-testid="login-submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    expect(page.url()).toContain('/dashboard');

    await context.close();
  });
});

test.describe('Member – Logout', () => {
  test('logout returns user to guest state', async ({ page }) => {
    await page.goto('/dashboard');
    // Click the logout button
    await page.locator('[data-testid="nav-logout"]').click();
    // After logout, NextAuth redirects to '/' (callbackUrl in signOut)
    await page.waitForURL('/', { timeout: 10_000 });
    // Guest nav should be visible again
    await expect(page.locator('[data-testid="nav-login-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-logout"]')).not.toBeVisible();
  });
});

/**
 * Auth setup – runs once before all E2E tests.
 *
 * Logs in as admin and as member, then persists the resulting
 * browser-storage state so individual spec files can reuse it
 * without going through the login UI every time.
 *
 * Credentials are read from env vars (see .env.test.example).
 */

import path from 'path';
import { test as setup, expect } from '@playwright/test';

export const ADMIN_AUTH_FILE = path.join(__dirname, '../../playwright/.auth/admin.json');
export const MEMBER_AUTH_FILE = path.join(__dirname, '../../playwright/.auth/member.json');

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@arkanum-akademie.de';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'Admin123!';
const MEMBER_EMAIL = process.env.E2E_MEMBER_EMAIL ?? 'mitglied@arkanum-akademie.de';
const MEMBER_PASSWORD = process.env.E2E_MEMBER_PASSWORD ?? 'Member123!';

async function loginAs(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
) {
  await page.goto('/login');
  await page.locator('[data-testid="login-email"]').fill(email);
  await page.locator('[data-testid="login-password"]').fill(password);
  await page.locator('[data-testid="login-submit"]').click();
  // Wait until the browser navigates away from /login
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

setup('authenticate as admin', async ({ page }) => {
  await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  // Admin may land on /dashboard initially before the useEffect redirects to /admin
  await page.waitForURL(/\/(admin|dashboard)/, { timeout: 10_000 });
  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});

setup('authenticate as member', async ({ page }) => {
  await loginAs(page, MEMBER_EMAIL, MEMBER_PASSWORD);
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
  await expect(page).toHaveURL(/\/dashboard/);
  await page.context().storageState({ path: MEMBER_AUTH_FILE });
});

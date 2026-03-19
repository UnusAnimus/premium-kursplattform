/**
 * Redirect & Protection Logic (D)
 *
 * Validates that the middleware correctly guards protected routes,
 * that login redirects stay relative (no wrong host/port),
 * and that role-based access control is enforced.
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// Most tests run as guest – no stored state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Redirect – Login page redirects', () => {
  test('callbackUrl in /login redirect is relative (no external host)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 10_000 });

    const url = new URL(page.url());
    // The page must be on localhost:3000, never on a different host
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('3000');

    // If a callbackUrl is present, it must be a relative path, not an absolute URL
    const callbackUrl = url.searchParams.get('callbackUrl');
    if (callbackUrl) {
      // It must NOT start with http:// or https://
      expect(callbackUrl).not.toMatch(/^https?:\/\//);
    }
  });

  test('already-authenticated page /login is a valid URL (no crash)', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../playwright/.auth/member.json'),
    });
    const page = await context.newPage();
    await page.goto('/login');
    // Logged-in user visiting /login should be redirected by the useEffect
    await page.waitForURL(/\/(dashboard|admin|login)/, { timeout: 10_000 });
    const finalUrl = new URL(page.url());
    expect(finalUrl.hostname).toBe('localhost');
    await context.close();
  });
});

test.describe('Redirect – Middleware protects all member routes (guest)', () => {
  const guardedPaths = [
    '/dashboard',
    '/meine-kurse',
    '/lernfortschritt',
    '/ki-assistent',
    '/profil',
    '/einstellungen',
    '/abo',
  ];

  for (const p of guardedPaths) {
    test(`GET ${p} → redirected to /login`, async ({ page }) => {
      await page.goto(p);
      await page.waitForURL(/\/login/, { timeout: 10_000 });
      expect(page.url()).toContain('/login');
    });
  }
});

test.describe('Redirect – Admin route blocked for non-admin (member)', () => {
  test('member visiting /admin is redirected to /dashboard', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../playwright/.auth/member.json'),
    });
    const page = await context.newPage();
    await page.goto('/admin');
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 10_000 });
    expect(page.url()).not.toContain('/admin');
    await context.close();
  });

  test('member visiting /admin/kurse is redirected to /dashboard', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../playwright/.auth/member.json'),
    });
    const page = await context.newPage();
    await page.goto('/admin/kurse');
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 10_000 });
    expect(page.url()).not.toContain('/admin');
    await context.close();
  });
});

test.describe('Redirect – Admin route blocked for guest', () => {
  test('guest visiting /admin is redirected to /login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    expect(page.url()).toContain('/login');
  });
});

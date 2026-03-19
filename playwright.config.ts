import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 *
 * Locally:  npm run test:e2e          (requires `npm start` or a running dev server)
 * CI:       handled by .github/workflows/ci.yml
 *
 * Auth setup runs once per test suite and saves session cookies to
 * playwright/.auth/ so individual tests don't have to log in repeatedly.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    // Auth setup – runs first, writes session files
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // All other tests depend on setup
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

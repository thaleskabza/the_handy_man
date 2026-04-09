import { defineConfig, devices } from '@playwright/test'

const ENV = process.env.ENV || 'local'

const envConfigs: Record<string, { baseURL: string; webURL: string }> = {
  local: {
    baseURL: 'http://localhost:3000',
    webURL: 'http://localhost:3001',
  },
  dev: {
    baseURL: process.env.API_URL || 'http://localhost:3000',
    webURL: process.env.WEB_URL || 'http://localhost:3001',
  },
}

const env = envConfigs[ENV] ?? envConfigs.local

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'tests/reports/playwright-report' }],
    ['json', { outputFile: 'tests/reports/results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    // API tests — no browser needed
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.ts',
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'] },
    },
    // E2E browser tests
    {
      name: 'e2e-chromium',
      testMatch: '**/tests/e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.webURL,
      },
    },
    {
      name: 'e2e-mobile',
      testMatch: '**/tests/e2e/**/*.spec.ts',
      use: {
        ...devices['Pixel 5'],
        baseURL: env.webURL,
      },
    },
  ],
})

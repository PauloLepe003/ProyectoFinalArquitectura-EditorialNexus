import { defineConfig } from '@playwright/test';
import fs from 'node:fs';
export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results/e2e',
  workers: 1,
  timeout: 45000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    channel:
      process.env.PLAYWRIGHT_CHANNEL ||
      (fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
        ? 'msedge'
        : undefined),
    baseURL: 'http://127.0.0.1:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node node_modules/tsx/dist/cli.mjs backend/src/server.ts',
    url: 'http://127.0.0.1:3001/api/health',
    reuseExistingServer: false,
    env: { NODE_ENV: 'test', PORT: '3001', APP_ORIGIN: 'http://127.0.0.1:3001' },
    timeout: 30000,
  },
});

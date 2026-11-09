import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['backend/src/tests/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
    reporters: ['default', 'json'],
    outputFile: { json: 'test-results/vitest.json' },
  },
});

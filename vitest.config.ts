/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Use Vitest globals (describe, it, expect, etc.)
    environment: 'jsdom', // Set the test environment to jsdom
    setupFiles: './vitest.setup.ts', // Optional: setup file (similar to jest.setup.js)
    // reporters: ['default', 'html'], // Optional: configure reporters
  },
})
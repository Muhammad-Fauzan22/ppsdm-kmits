import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next', 'dist', '**/*.stories.tsx'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/**/*.d.ts',
                'src/app/**',
                'src/components/ui/**'
            ],
            thresholds: {
                lines: 50,
                functions: 50,
                branches: 50,
                statements: 50
            }
        },
        reporters: ['default', 'hanging-process'],
        teardownTimeout: 10000,
        retry: 1,
        testTimeout: 10000,
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})

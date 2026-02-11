import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        setupFiles: ['./src/tests/setup.ts'],
        globals: true,
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.d.ts',
                '**/*.config.{js,ts}',
                '**/types/**',
            ],
            thresholds: {
                lines: 60,
                functions: 60,
                branches: 50,
                statements: 60,
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    esbuild: {
        target: 'es2020'
    }
})

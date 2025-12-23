import { defineConfig } from 'vite'

export default defineConfig({
    base: '/calculator-demo/',
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/core/**', 'src/utils/**'],
            exclude: ['**/*.test.ts', '**/*.spec.ts'],
        },
    },
})

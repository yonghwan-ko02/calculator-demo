import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/core/**', 'src/utils/**'],
            exclude: ['**/*.test.ts', '**/*.spec.ts'],
        },
    },
})

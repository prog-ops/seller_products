import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: './tests/setup.js',
        testTimeout: 15000,
        fileParallelism: false, // Jalankan file test secara sequential (shared DB)
        env: {
            NODE_ENV: 'test',
        },
    },
});

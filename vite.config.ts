import { spawnSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const phpCheck = spawnSync('php', ['-v'], { stdio: 'ignore' });
const hasPhp = phpCheck.status === 0 && !phpCheck.error;
const wayfinderEnabled = process.env.WAYFINDER_ENABLED === 'true'
    ? true
    : process.env.WAYFINDER_ENABLED === 'false'
        ? false
        : hasPhp;

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        ...(wayfinderEnabled
            ? [
                wayfinder({
                    formVariants: true,
                }),
            ]
            : []),
    ],
    // server: {
    //     host: '127.0.0.1',
    //     port:8000,
    //     cors: true,
    //     allowedHosts: 'all',
    //     hmr: {
    //         host: process.env.VITE_TUNNEL_HOST || undefined,
    //         protocol: process.env.VITE_TUNNEL_HOST ? 'wss' : undefined,
    //         clientPort: process.env.VITE_TUNNEL_HOST ? 443 : undefined,
    //     },
    // },
});

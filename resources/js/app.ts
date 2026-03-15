import { createInertiaApp } from '@inertiajs/vue3';
import { configureEcho } from '@laravel/echo-vue';
import Echo from 'laravel-echo';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import Pusher from 'pusher-js';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import '../css/app.css';
import { initializeTheme } from '@/composables/useAppearance';

window.Pusher = Pusher;

// Enable Pusher logging in development
if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
}

// Initialize Echo with Pusher broadcaster — persistent connection
const echoConfig = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'sa1',
    forceTLS: true,
    encrypted: true,
    activityTimeout: 120000,
    pongTimeout: 30000,
};

window.Echo = new Echo(echoConfig);
configureEcho(echoConfig);

// Global persistent subscription to FileTracking channel — NEVER leaves
window.Echo.channel('FileTracking')
    .listen('.Notification', (data: any) => {
        console.log('✅ [Global] Notification received via Pusher:', data);
        window.dispatchEvent(new CustomEvent('pusher-notification', { detail: data }));
    });

console.log('📡 Echo configured & subscribed to FileTracking (persistent)');


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import '../css/app.css';
import { initializeTheme } from '@/composables/useAppearance';
import { configureEcho } from '@laravel/echo-vue';
import axios from 'axios';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Configure axios defaults for CSRF and CORS
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}
axios.defaults.withCredentials = true;

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
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
    },
};

window.Echo = new Echo(echoConfig);
configureEcho(echoConfig);

// Global persistent subscription to FileTracking public channel — NEVER leaves
window.Echo.channel('FileTracking')
    .listen('.Notification', (data: any) => {
        console.log('✅ [Global] Notification received via Pusher (public):', data);
        window.dispatchEvent(new CustomEvent('pusher-notification', { detail: data }));
    });

// Subscribe to private user channel once Inertia page is ready
// This ensures notifications are received on ALL pages, not just dashboard
const subscribeToPrivateChannel = () => {
    try {
        // Get user ID from Inertia page props embedded in the DOM
        const pageEl = document.getElementById('app');
        if (pageEl) {
            const dataPage = pageEl.getAttribute('data-page');
            if (dataPage) {
                const pageData = JSON.parse(dataPage);
                const userId = pageData?.props?.auth?.user?.id;
                if (userId && !(window as any).__notifChannelSubscribed) {
                    (window as any).__notifChannelSubscribed = true;
                    window.Echo.private(`notifications.${userId}`)
                        .listen('.notification.sent', (data: any) => {
                            console.log('✅ [Private] Notification received via Pusher:', data);
                            const detail = {
                                notification_id: data.notification?.id,
                                user_id: userId,
                                message: data.notification?.data?.message,
                                data: data.notification?.data,
                                created_at: data.notification?.created_at,
                            };
                            window.dispatchEvent(new CustomEvent('pusher-notification', { detail }));
                        });
                    console.log(`🔒 Subscribed to private channel notifications.${userId}`);
                }
            }
        }
    } catch (e) {
        console.error('Failed to subscribe to private notification channel:', e);
    }
};

// Try subscribing immediately and also after Inertia navigations
subscribeToPrivateChannel();
document.addEventListener('inertia:finish', subscribeToPrivateChannel);

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

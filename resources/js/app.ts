import { createInertiaApp } from '@inertiajs/vue3';
import { configureEcho } from '@laravel/echo-vue';
import axios from 'axios';
import Echo from 'laravel-echo';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import Pusher from 'pusher-js';
import { createApp, h } from 'vue';
import type { DefineComponent } from 'vue';
import { initializeTheme } from '@/composables/useAppearance';
import '../css/app.css';

window.Pusher = Pusher;

// Configure axios defaults for CSRF - use cookie-based XSRF exclusively
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
}

const echoConfig: any = {
    broadcaster: 'pusher' as const,
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'sa1',
    forceTLS: true,
    encrypted: true,
    activityTimeout: 120000,
    pongTimeout: 30000,
    authorizer: (channel: { name: string }) => ({
        authorize: (socketId: string, callback: (error: Error | null, data: unknown) => void) => {
            axios.post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
            }).then((response) => {
                callback(null, response.data);
            }).catch((error: unknown) => {
                callback(error instanceof Error ? error : new Error("Broadcast auth failed"), null);
            });
        },
    }),
};

window.Echo = new Echo(echoConfig);
configureEcho(echoConfig);

const subscribeRealtimeChannels = () => {
    try {
        const pageEl = document.getElementById('app');
        if (!pageEl) return;

        const dataPage = pageEl.getAttribute('data-page');
        if (!dataPage) return;

        const pageData = JSON.parse(dataPage);
        const userId = pageData?.props?.auth?.user?.id;

        if (!userId || (window as Window & { __fileTrackingSubscribed?: boolean }).__fileTrackingSubscribed) return;

        (window as Window & { __fileTrackingSubscribed?: boolean }).__fileTrackingSubscribed = true;

        window.Echo.private('filetracking')
            .listen('.DashboardUpdated', (data: unknown) => {
                window.dispatchEvent(new CustomEvent('dashboard-updated', { detail: data }));
            })
            .listen('.task.activity', (data: unknown) => {
                window.dispatchEvent(new CustomEvent('task-activity', { detail: data }));
            });

        window.Echo.private('notifications.' + userId)
            .listen('.Notification', (data: unknown) => {
                window.dispatchEvent(new CustomEvent('pusher-notification', { detail: data }));
            })
            .listen('.notification.sent', (data: unknown) => {
                const typedData = data as {
                    notification?: {
                        id?: string;
                        data?: {
                            message?: string;
                            title?: string;
                            type?: string;
                        };
                        created_at?: string;
                    };
                };

                const detail = {
                    notification_id: typedData.notification?.id,
                    user_id: userId,
                    message: typedData.notification?.data?.message,
                    data: typedData.notification?.data,
                    created_at: typedData.notification?.created_at,
                };

                window.dispatchEvent(new CustomEvent('pusher-notification', { detail }));
            })
            .listen('.NotificationStatusChanged', (data: unknown) => {
                window.dispatchEvent(new CustomEvent('notification-status-changed', { detail: data }));
            });
    } catch (e) {
        console.error('Failed to subscribe to realtime channels:', e);
    }
};

subscribeRealtimeChannels();
document.addEventListener('inertia:finish', subscribeRealtimeChannels);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? title + ' - ' + appName : appName),
    resolve: (name) =>
        resolvePageComponent(
            './pages/' + name + '.vue',
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

initializeTheme();

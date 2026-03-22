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

type ConnectionState = 'connecting' | 'connected' | 'disconnected';

type SyncReason = 'initial' | 'reconnected' | 'manual';

window.Pusher = Pusher;

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
                callback(error instanceof Error ? error : new Error('Broadcast auth failed'), null);
            });
        },
    }),
};

window.Echo = new Echo(echoConfig);
configureEcho(echoConfig);

const dispatchRealtimeConnection = (state: ConnectionState) => {
    window.dispatchEvent(new CustomEvent('realtime-connection', { detail: { state, at: new Date().toISOString() } }));
};

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const isTaskActivityPayload = (payload: unknown): payload is { action: string; task?: { id: number } } => {
    if (!isObject(payload)) return false;
    if (typeof payload.action !== 'string') return false;
    if (!('task' in payload) || payload.task === null || payload.task === undefined) return true;
    return isObject(payload.task) && typeof payload.task.id === 'number';
};

const isNotificationPayload = (payload: unknown): payload is {
    notification_id?: string;
    user_id?: number;
    message?: string;
    data?: Record<string, unknown>;
    created_at?: string;
} => {
    if (!isObject(payload)) return false;
    if ('notification_id' in payload && typeof payload.notification_id !== 'string' && payload.notification_id !== undefined) return false;
    if ('user_id' in payload && typeof payload.user_id !== 'number' && payload.user_id !== undefined) return false;
    return true;
};

let syncInFlight = false;
let lastSyncAt = '';

const buildJsonConfig = () => ({
    headers: {
        Accept: 'application/json',
    },
});

const syncRealtimeState = async (reason: SyncReason): Promise<void> => {
    if (syncInFlight) return;

    syncInFlight = true;

    try {
        const [dashboardRes, tasksRes, notificationsRes] = await Promise.all([
            axios.get('/api/v1/dashboard', buildJsonConfig()),
            axios.get('/api/v1/tasks', buildJsonConfig()),
            axios.get('/api/v1/notifications', buildJsonConfig()),
        ]);

        lastSyncAt = new Date().toISOString();

        window.dispatchEvent(new CustomEvent('dashboard-synced', {
            detail: {
                reason,
                syncedAt: lastSyncAt,
                payload: dashboardRes.data,
            },
        }));

        window.dispatchEvent(new CustomEvent('tasks-synced', {
            detail: {
                reason,
                syncedAt: lastSyncAt,
                payload: tasksRes.data,
            },
        }));

        window.dispatchEvent(new CustomEvent('notifications-synced', {
            detail: {
                reason,
                syncedAt: lastSyncAt,
                payload: notificationsRes.data,
            },
        }));
    } catch (error) {
        console.error('Realtime state sync failed:', error);
    } finally {
        syncInFlight = false;
    }
};

const subscribeRealtimeChannels = () => {
    try {
        const pageEl = document.getElementById('app');
        if (!pageEl) return;

        const dataPage = pageEl.getAttribute('data-page');
        if (!dataPage) return;

        const pageData = JSON.parse(dataPage);
        const userId = pageData?.props?.auth?.user?.id;

        if (!userId) return;

        if ((window as Window & { __fileTrackingSubscribed?: boolean }).__fileTrackingSubscribed) return;

        (window as Window & { __fileTrackingSubscribed?: boolean }).__fileTrackingSubscribed = true;

        window.Echo.private('filetracking')
            .listen('.DashboardUpdated', (data: unknown) => {
                if (!isObject(data)) return;
                window.dispatchEvent(new CustomEvent('dashboard-updated', { detail: data }));
            })
            .listen('.task.activity', (data: unknown) => {
                if (!isTaskActivityPayload(data)) return;
                window.dispatchEvent(new CustomEvent('task-activity', { detail: data }));
            });

        window.Echo.private('notifications.' + userId)
            .listen('.Notification', (data: unknown) => {
                if (!isNotificationPayload(data)) return;
                window.dispatchEvent(new CustomEvent('pusher-notification', { detail: data }));
            })
            .listen('.notification.sent', (data: unknown) => {
                if (!isObject(data) || !isObject(data.notification)) return;

                const detail = {
                    notification_id: typeof data.notification.id === 'string' ? data.notification.id : undefined,
                    user_id: userId,
                    message: isObject(data.notification.data) && typeof data.notification.data.message === 'string' ? data.notification.data.message : undefined,
                    data: isObject(data.notification.data) ? data.notification.data : undefined,
                    created_at: typeof data.notification.created_at === 'string' ? data.notification.created_at : undefined,
                };

                window.dispatchEvent(new CustomEvent('pusher-notification', { detail }));
            })
            .listen('.NotificationStatusChanged', (data: unknown) => {
                if (!isObject(data)) return;
                window.dispatchEvent(new CustomEvent('notification-status-changed', { detail: data }));
            });

        const connection = window.Echo.connector?.pusher?.connection;

        if (connection) {
            connection.bind('connecting', () => dispatchRealtimeConnection('connecting'));

            connection.bind('connected', () => {
                dispatchRealtimeConnection('connected');
                syncRealtimeState('reconnected');
            });

            connection.bind('disconnected', () => dispatchRealtimeConnection('disconnected'));

            connection.bind('unavailable', () => dispatchRealtimeConnection('disconnected'));
        }

        syncRealtimeState('initial');
    } catch (e) {
        console.error('Failed to subscribe to realtime channels:', e);
    }
};

subscribeRealtimeChannels();
document.addEventListener('inertia:finish', subscribeRealtimeChannels);

document.addEventListener('realtime-force-sync', () => {
    syncRealtimeState('manual');
});

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

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
type QueueFlushReason = 'connected' | 'online' | 'manual';
type QueueableMethod = 'post' | 'put' | 'patch' | 'delete';

interface PendingRequest {
    id: string;
    url: string;
    method: QueueableMethod;
    data: unknown;
    headers: Record<string, string>;
    attempts: number;
    queuedAt: string;
}

const REQUEST_QUEUE_STORAGE_KEY = 'filetracking.pending-requests.v1';
const REQUEST_QUEUE_MAX_ITEMS = 100;
const REQUEST_QUEUE_MAX_ATTEMPTS = 5;

let syncInFlight = false;
let lastSyncAt = '';
let realtimeConnected = false;
let isFlushingQueue = false;

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
    wsHost: import.meta.env.VITE_PUSHER_HOST || undefined,
    wsPort: Number(import.meta.env.VITE_PUSHER_PORT || 80),
    wssPort: Number(import.meta.env.VITE_PUSHER_PORT || 443),
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
    encrypted: true,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
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

const emitQueueSize = (count: number) => {
    window.dispatchEvent(new CustomEvent('request-queue-updated', {
        detail: { count, at: new Date().toISOString() },
    }));
};

const parseQueue = (): PendingRequest[] => {
    try {
        const raw = localStorage.getItem(REQUEST_QUEUE_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is PendingRequest => {
            if (!isObject(item)) return false;

            return (
                typeof item.id === 'string' &&
                typeof item.url === 'string' &&
                typeof item.method === 'string' &&
                ['post', 'put', 'patch', 'delete'].includes(item.method) &&
                typeof item.attempts === 'number'
            );
        });
    } catch {
        return [];
    }
};

const saveQueue = (queue: PendingRequest[]) => {
    localStorage.setItem(REQUEST_QUEUE_STORAGE_KEY, JSON.stringify(queue));
    emitQueueSize(queue.length);
};

const normalizeMethod = (method: unknown): QueueableMethod | null => {
    if (typeof method !== 'string') return null;

    const normalized = method.toLowerCase();

    if (normalized === 'post' || normalized === 'put' || normalized === 'patch' || normalized === 'delete') {
        return normalized;
    }

    return null;
};

const normalizeHeaders = (headers: unknown): Record<string, string> => {
    if (!headers || typeof headers !== 'object') return {};

    const normalized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
        if (typeof value === 'string') {
            normalized[key] = value;
        }
    }

    return normalized;
};

const normalizeUrl = (url: unknown): string | null => {
    if (typeof url !== 'string' || !url.trim()) return null;

    if (url.startsWith('/')) return url;

    try {
        const parsed = new URL(url, window.location.origin);

        if (parsed.origin !== window.location.origin) return null;

        return parsed.pathname + parsed.search;
    } catch {
        return null;
    }
};

const enqueueFailedRequest = (error: unknown): boolean => {
    if (!axios.isAxiosError(error) || !error.config) return false;
    if (error.response) return false;

    const headers = normalizeHeaders(error.config.headers);
    if (headers['X-Queue-Replay'] === '1') return false;

    const method = normalizeMethod(error.config.method);
    const url = normalizeUrl(error.config.url);
    if (!method || !url) return false;

    const queue = parseQueue();
    queue.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        url,
        method,
        data: error.config.data ?? null,
        headers,
        attempts: 0,
        queuedAt: new Date().toISOString(),
    });

    const boundedQueue = queue.slice(-REQUEST_QUEUE_MAX_ITEMS);
    saveQueue(boundedQueue);

    window.dispatchEvent(new CustomEvent('request-queued', {
        detail: { url, method, queuedAt: new Date().toISOString() },
    }));

    return true;
};

const flushQueuedRequests = async (reason: QueueFlushReason = 'manual') => {
    if (isFlushingQueue) return;
    if (!navigator.onLine || !realtimeConnected) return;

    const queue = parseQueue();
    if (!queue.length) return;

    isFlushingQueue = true;

    const remaining: PendingRequest[] = [];

    for (const request of queue) {
        if (request.attempts >= REQUEST_QUEUE_MAX_ATTEMPTS) continue;

        try {
            await axios.request({
                url: request.url,
                method: request.method,
                data: request.data,
                headers: {
                    ...request.headers,
                    'X-Queue-Replay': '1',
                    'X-Queue-Replay-Reason': reason,
                },
            });

            window.dispatchEvent(new CustomEvent('request-replayed', {
                detail: { id: request.id, url: request.url, method: request.method },
            }));
        } catch (error) {
            if (axios.isAxiosError(error) && !error.response) {
                remaining.push({
                    ...request,
                    attempts: request.attempts + 1,
                });
            }
        }
    }

    saveQueue(remaining);
    isFlushingQueue = false;
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
                realtimeConnected = true;
                dispatchRealtimeConnection('connected');
                syncRealtimeState('reconnected');
                void flushQueuedRequests('connected');
            });

            connection.bind('disconnected', () => {
                realtimeConnected = false;
                dispatchRealtimeConnection('disconnected');
            });

            connection.bind('unavailable', () => {
                realtimeConnected = false;
                dispatchRealtimeConnection('disconnected');
            });
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
    void flushQueuedRequests('manual');
});

window.addEventListener('online', () => {
    dispatchRealtimeConnection('connecting');
    void flushQueuedRequests('online');
});

window.addEventListener('offline', () => {
    realtimeConnected = false;
    dispatchRealtimeConnection('disconnected');
});

axios.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const queued = enqueueFailedRequest(error);

        if (!queued) {
            return Promise.reject(error);
        }

        return Promise.reject(new Error('Request queued for replay after reconnect.'));
    },
);

emitQueueSize(parseQueue().length);

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

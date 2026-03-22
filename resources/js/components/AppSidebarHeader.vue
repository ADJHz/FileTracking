<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { onMounted, onUnmounted, ref } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import NotificationDropdown from '@/components/NotificationDropdown.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

type ConnectionState = 'connecting' | 'connected' | 'disconnected';
type ToastKind = 'success' | 'danger' | 'warning';

interface ToastItem {
    id: number;
    kind: ToastKind;
    message: string;
}

const page = usePage();
const user = page.props.auth?.user;

const toasts = ref<ToastItem[]>([]);

const TOAST_DURATION_MS = 4500;
const TOAST_MAX_ITEMS = 4;

let toastId = 0;
let lastConnectionState: ConnectionState = 'connecting';
let queuedRequests = 0;
let queueInitialized = false;

const pushToast = (kind: ToastKind, message: string) => {
    const id = ++toastId;

    toasts.value = [...toasts.value, { id, kind, message }].slice(-TOAST_MAX_ITEMS);

    window.setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, TOAST_DURATION_MS);
};

const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

const toastContainerClass = (kind: ToastKind) => {
    if (kind === 'success') {
        return 'border-emerald-200 bg-emerald-50/95 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200';
    }

    if (kind === 'danger') {
        return 'border-red-200 bg-red-50/95 text-red-800 dark:border-red-800 dark:bg-red-950/70 dark:text-red-200';
    }

    return 'border-dorado-300 bg-dorado-50/95 text-dorado-800 dark:border-dorado-800 dark:bg-dorado-950/70 dark:text-dorado-100';
};

const toastIconWrapClass = (kind: ToastKind) => {
    if (kind === 'success') {
        return 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/60';
    }

    if (kind === 'danger') {
        return 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/60';
    }

    return 'text-dorado-700 bg-dorado-100 dark:text-dorado-100 dark:bg-dorado-900/50';
};

const onRealtimeConnection = ((event: CustomEvent) => {
    const state = event.detail?.state as ConnectionState | undefined;
    if (!state) return;

    if (state === 'disconnected' && lastConnectionState !== 'disconnected') {
        pushToast('danger', 'Se perdio la conexion. Las solicitudes nuevas se pondran en cola.');
    }

    if (state === 'connected' && lastConnectionState === 'disconnected') {
        if (queuedRequests > 0) {
            pushToast('warning', `Conexion restablecida. Reintentando ${queuedRequests} solicitud(es) pendientes.`);
        } else {
            pushToast('success', 'Conexion restablecida correctamente.');
        }
    }

    lastConnectionState = state;
}) as EventListener;

const onQueueUpdate = ((event: CustomEvent) => {
    const count = event.detail?.count;
    if (typeof count !== 'number' || count < 0) return;

    if (!queueInitialized) {
        queuedRequests = count;
        queueInitialized = true;
        return;
    }

    const previous = queuedRequests;
    queuedRequests = count;

    if (count > 0 && previous === 0) {
        pushToast('warning', `Se guardaron ${count} solicitud(es) para envio automatico al reconectar.`);
    }

    if (count === 0 && previous > 0) {
        pushToast('success', 'Solicitudes pendientes sincronizadas exitosamente.');
    }
}) as EventListener;

onMounted(() => {
    window.addEventListener('realtime-connection', onRealtimeConnection);
    window.addEventListener('request-queue-updated', onQueueUpdate);
});

onUnmounted(() => {
    window.removeEventListener('realtime-connection', onRealtimeConnection);
    window.removeEventListener('request-queue-updated', onQueueUpdate);
});
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center gap-2 border-b border-white/40 bg-sidebar px-6 text-white shadow-[inset_1px_0_0_rgba(255,255,255,0.22)] md:border-l md:border-l-white/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 [&_button:hover]:!bg-dorado-400/20 [&_a:hover]:!text-dorado-300"
    >
        <div class="flex items-center gap-2 [&_*]:!text-white [&_svg]:!text-white">
            <SidebarTrigger class="-ml-1" />
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>

        <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <NotificationDropdown v-if="user" :user-id="user.id" />
        </div>
    </header>

    <div class="pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-2">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            role="alert"
            class="pointer-events-auto flex items-center rounded-base border p-4 shadow-xs backdrop-blur-sm"
            :class="toastContainerClass(toast.kind)"
        >
            <div class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded" :class="toastIconWrapClass(toast.kind)">
                <svg v-if="toast.kind === 'success'" class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                </svg>
                <svg v-else-if="toast.kind === 'danger'" class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                <svg v-else class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span class="sr-only">Estado</span>
            </div>

            <div class="ms-3 text-sm font-medium">{{ toast.message }}</div>

            <button
                type="button"
                class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded border border-transparent bg-transparent text-current hover:bg-black/5 focus:outline-none"
                aria-label="Cerrar"
                @click="removeToast(toast.id)"
            >
                <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';
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

const page = usePage();
const user = page.props.auth?.user;

const connectionState = ref<'connecting' | 'connected' | 'disconnected'>('connecting');

const statusLabel = computed(() => {
    if (connectionState.value === 'connected') return 'Realtime conectado';
    if (connectionState.value === 'disconnected') return 'Sin conexion realtime';
    return 'Conectando realtime...';
});

const mobileStatusLabel = computed(() => {
    if (connectionState.value === 'connected') return 'Online';
    if (connectionState.value === 'disconnected') return 'Offline';
    return 'Sync...';
});

const statusClass = computed(() => {
    if (connectionState.value === 'connected') {
        return 'bg-emerald-100/90 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
    }

    if (connectionState.value === 'disconnected') {
        return 'bg-red-100/90 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
    }

    return 'bg-amber-100/90 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
});

const dotClass = computed(() => {
    if (connectionState.value === 'connected') return 'bg-emerald-500';
    if (connectionState.value === 'disconnected') return 'bg-red-500';
    return 'bg-amber-500';
});

const onRealtimeConnection = ((event: CustomEvent) => {
    const state = event.detail?.state;
    if (state === 'connecting' || state === 'connected' || state === 'disconnected') {
        connectionState.value = state;
    }
}) as EventListener;

onMounted(() => {
    window.addEventListener('realtime-connection', onRealtimeConnection);
});

onUnmounted(() => {
    window.removeEventListener('realtime-connection', onRealtimeConnection);
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
            <div class="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px] font-semibold transition-colors sm:px-2.5 sm:text-xs" :class="statusClass">
                <span class="h-2 w-2 rounded-full" :class="dotClass" />
                <span class="sm:hidden">{{ mobileStatusLabel }}</span>
                <span class="hidden sm:inline">{{ statusLabel }}</span>
            </div>
            <NotificationDropdown v-if="user" :user-id="user.id" />
        </div>
    </header>
</template>

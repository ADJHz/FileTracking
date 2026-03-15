<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import { Bell, Trash2, Info, AlertTriangle, CheckCircle, AlertCircle, CheckCheck } from 'lucide-vue-next';
import axios from 'axios';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        type?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    total: number;
}

const props = defineProps<{
    notifications: PaginatedNotifications;
    unreadCount: number;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel de Control', href: dashboard() },
    { title: 'Notificaciones', href: '/notifications' },
];

const allNotifications = ref<Notification[]>(props.notifications.data);
const unreadCount = ref(props.unreadCount);
const activeTab = ref<'all' | 'unread'>('all');

const filteredNotifications = computed(() => {
    if (activeTab.value === 'unread') {
        return allNotifications.value.filter(n => !n.read_at);
    }
    return allNotifications.value;
});

const newNotifications = computed(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return filteredNotifications.value.filter(n => new Date(n.created_at) > oneDayAgo);
});

const olderNotifications = computed(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return filteredNotifications.value.filter(n => new Date(n.created_at) <= oneDayAgo);
});

const markAsRead = async (notification: Notification) => {
    if (notification.read_at) return;
    try {
        await axios.patch(`/notifications/${notification.id}/read`);
        notification.read_at = new Date().toISOString();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

const markAllAsRead = async () => {
    try {
        await axios.patch('/notifications/mark-all-read');
        allNotifications.value.forEach(n => {
            n.read_at = new Date().toISOString();
        });
        unreadCount.value = 0;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
};

const deleteNotification = async (notification: Notification) => {
    try {
        await axios.delete(`/notifications/${notification.id}`);
        const index = allNotifications.value.findIndex(n => n.id === notification.id);
        if (index > -1) {
            const wasUnread = !allNotifications.value[index].read_at;
            allNotifications.value.splice(index, 1);
            if (wasUnread) {
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} d`;
    return `hace ${Math.floor(diffInSeconds / 604800)} sem`;
};

const getTypeConfig = (type?: string) => {
    switch (type) {
        case 'success':
            return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle };
        case 'warning':
            return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertTriangle };
        case 'error':
            return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle };
        default:
            return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Info };
    }
};

const getAvatarColor = (type?: string) => {
    switch (type) {
        case 'success': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
        case 'warning': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
        case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
        default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
    }
};
</script>

<template>
    <Head title="Notificaciones" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col p-4 md:p-6">
            <div class="mx-auto w-full max-w-2xl">
                <!-- Header -->
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-foreground">Notificaciones</h1>
                        <p class="text-sm text-muted-foreground mt-1">
                            {{ allNotifications.length }} notificaciones · {{ unreadCount }} sin leer
                        </p>
                    </div>
                    <Button
                        v-if="unreadCount > 0"
                        variant="outline"
                        size="sm"
                        @click="markAllAsRead"
                        class="gap-2"
                    >
                        <CheckCheck class="h-4 w-4" />
                        Marcar todas como leídas
                    </Button>
                </div>

                <!-- Tabs -->
                <div class="flex items-center gap-2 mb-6">
                    <button
                        @click="activeTab = 'all'"
                        :class="[
                            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                            activeTab === 'all'
                                ? 'bg-guinda-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        ]"
                    >
                        Todas
                    </button>
                    <button
                        @click="activeTab = 'unread'"
                        :class="[
                            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                            activeTab === 'unread'
                                ? 'bg-guinda-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        ]"
                    >
                        No leídas
                        <Badge
                            v-if="unreadCount > 0"
                            class="ml-1.5 bg-dorado-400 text-white border-none text-xs px-1.5 py-0"
                        >
                            {{ unreadCount }}
                        </Badge>
                    </button>
                </div>

                <!-- Empty state -->
                <div
                    v-if="filteredNotifications.length === 0"
                    class="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Bell class="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 class="text-lg font-medium text-foreground mb-1">
                        {{ activeTab === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones' }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        Las notificaciones del sistema aparecerán aquí.
                    </p>
                </div>

                <!-- Notifications list -->
                <div v-else>
                    <!-- New notifications section -->
                    <div v-if="newNotifications.length > 0" class="mb-6">
                        <h2 class="text-sm font-semibold text-foreground mb-3 px-1">Nuevas</h2>
                        <div class="space-y-1">
                            <div
                                v-for="notification in newNotifications"
                                :key="notification.id"
                                class="group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                                :class="[
                                    notification.read_at
                                        ? 'hover:bg-accent/50'
                                        : 'bg-guinda-50/50 dark:bg-guinda-900/20 hover:bg-guinda-50 dark:hover:bg-guinda-900/30'
                                ]"
                                @click="markAsRead(notification)"
                            >
                                <!-- Avatar -->
                                <div class="relative shrink-0">
                                    <Avatar class="h-12 w-12">
                                        <AvatarFallback :class="getAvatarColor(notification.data?.type)">
                                            <component :is="getTypeConfig(notification.data?.type).icon" class="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        class="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-background"
                                        :class="getTypeConfig(notification.data?.type).bg"
                                    >
                                        <component :is="getTypeConfig(notification.data?.type).icon" class="h-3 w-3" :class="getTypeConfig(notification.data?.type).color" />
                                    </div>
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-foreground">
                                        <span class="font-semibold">{{ notification.data?.title || 'Notificación' }}</span>
                                        {{ ' ' }}
                                        <span class="text-muted-foreground">{{ notification.data?.message || 'Sin mensaje' }}</span>
                                    </p>
                                    <p class="text-xs mt-1" :class="notification.read_at ? 'text-muted-foreground' : 'text-guinda-600 dark:text-dorado-400 font-medium'">
                                        {{ formatTimeAgo(notification.created_at) }}
                                    </p>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-1 shrink-0">
                                    <div
                                        v-if="!notification.read_at"
                                        class="h-3 w-3 rounded-full bg-dorado-400"
                                        title="Sin leer"
                                    ></div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                                        @click.stop="deleteNotification(notification)"
                                        title="Eliminar"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Older notifications section -->
                    <div v-if="olderNotifications.length > 0">
                        <h2 class="text-sm font-semibold text-foreground mb-3 px-1">Anteriores</h2>
                        <div class="space-y-1">
                            <div
                                v-for="notification in olderNotifications"
                                :key="notification.id"
                                class="group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                                :class="[
                                    notification.read_at
                                        ? 'hover:bg-accent/50'
                                        : 'bg-guinda-50/50 dark:bg-guinda-900/20 hover:bg-guinda-50 dark:hover:bg-guinda-900/30'
                                ]"
                                @click="markAsRead(notification)"
                            >
                                <!-- Avatar -->
                                <div class="relative shrink-0">
                                    <Avatar class="h-12 w-12">
                                        <AvatarFallback :class="getAvatarColor(notification.data?.type)">
                                            <component :is="getTypeConfig(notification.data?.type).icon" class="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        class="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-background"
                                        :class="getTypeConfig(notification.data?.type).bg"
                                    >
                                        <component :is="getTypeConfig(notification.data?.type).icon" class="h-3 w-3" :class="getTypeConfig(notification.data?.type).color" />
                                    </div>
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-foreground">
                                        <span class="font-semibold">{{ notification.data?.title || 'Notificación' }}</span>
                                        {{ ' ' }}
                                        <span class="text-muted-foreground">{{ notification.data?.message || 'Sin mensaje' }}</span>
                                    </p>
                                    <p class="text-xs mt-1" :class="notification.read_at ? 'text-muted-foreground' : 'text-guinda-600 dark:text-dorado-400 font-medium'">
                                        {{ formatTimeAgo(notification.created_at) }}
                                    </p>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-1 shrink-0">
                                    <div
                                        v-if="!notification.read_at"
                                        class="h-3 w-3 rounded-full bg-dorado-400"
                                        title="Sin leer"
                                    ></div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                                        @click.stop="deleteNotification(notification)"
                                        title="Eliminar"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

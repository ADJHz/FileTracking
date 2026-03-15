<script setup lang="ts">
import axios from 'axios';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, AlertCircle, Clock } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

defineProps<{
    userId: number;
}>();

const notifications = ref<Notification[]>([]);
const unreadCount = ref(0);
const isLoading = ref(false);
const isOpen = ref(false);
const showModal = ref(false);
const selectedNotification = ref<Notification | null>(null);

// Refresh list from server when dropdown is opened
watch(isOpen, (opened) => {
    if (opened) {
        fetchNotifications();
    }
});

const openNotification = async (notification: Notification) => {
    selectedNotification.value = notification;
    isOpen.value = false;
    showModal.value = true;

    // Mark as read if unread
    if (!notification.read_at) {
        try {
            await axios.patch(`/notifications/${notification.id}/read`);
            notification.read_at = new Date().toISOString();
            unreadCount.value = Math.max(0, unreadCount.value - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }
};

const markAllAsRead = async () => {
    try {
        await axios.patch('/notifications/mark-all-read');
        notifications.value.forEach(n => {
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
        const index = notifications.value.findIndex(n => n.id === notification.id);
        if (index > -1) {
            const wasUnread = !notifications.value[index].read_at;
            notifications.value.splice(index, 1);
            if (wasUnread) {
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

const fetchNotifications = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get('/notifications');
        notifications.value = response.data.notifications.data;
        unreadCount.value = response.data.unread_count;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    } finally {
        isLoading.value = false;
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
};

const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getTypeConfig = (type?: string) => {
    switch (type) {
        case 'success':
            return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Éxito' };
        case 'warning':
            return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Advertencia' };
        case 'error':
            return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Error' };
        default:
            return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Información' };
    }
};

const deleteAndClose = async () => {
    if (selectedNotification.value) {
        await deleteNotification(selectedNotification.value);
        showModal.value = false;
        selectedNotification.value = null;
    }
};

onMounted(() => {
    fetchNotifications();

    // Listen for global Pusher notifications dispatched from app.ts
    window.addEventListener('pusher-notification', ((event: CustomEvent) => {
        const data = event.detail;
        console.log('✅ NotificationDropdown received event:', data);

        const newNotification: Notification = {
            id: data.notification_id || (data.user_id + '-' + Date.now()),
            type: 'App\\Notifications\\Notification',
            data: {
                title: data.data?.title || 'Nueva notificación',
                message: data.message || data.data?.message || '',
                type: data.data?.type || 'info',
            },
            read_at: null,
            created_at: data.created_at || new Date().toISOString(),
        };

        notifications.value.unshift(newNotification);
        unreadCount.value += 1;
    }) as EventListener);
});

onUnmounted(() => {
    // No Echo leave — the global subscription in app.ts stays alive forever
});
</script>

<template>
    <DropdownMenu v-model:open="isOpen">
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                size="icon"
                class="relative h-9 w-9 rounded-full hover:bg-accent"
                @click="fetchNotifications"
            >
                <Bell class="h-4 w-4" />
                <Badge
                    v-if="unreadCount > 0"
                    variant="destructive"
                    class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                </Badge>
                <span class="sr-only">Ver notificaciones</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-80">
            <DropdownMenuLabel class="flex items-center justify-between">
                <span>Notificaciones</span>
                <Button
                    v-if="unreadCount > 0"
                    variant="ghost"
                    size="sm"
                    @click="markAllAsRead"
                    class="text-xs"
                >
                    Marcar todas como leídas
                </Button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div v-if="isLoading" class="p-4 text-center text-sm text-muted-foreground">
                Cargando...
            </div>

            <div v-else-if="notifications.length === 0" class="p-4 text-center text-sm text-muted-foreground">
                No tienes notificaciones
            </div>

            <div v-else class="max-h-96 overflow-y-auto">
                <DropdownMenuItem
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="flex flex-col items-start p-4 cursor-pointer hover:bg-accent/50"
                    @click="openNotification(notification)"
                >
                    <div class="flex items-start justify-between w-full">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="text-sm font-medium leading-none">
                                    {{ notification.data?.title || 'Notificación' }}
                                </h4>
                                <div
                                    v-if="!notification.read_at"
                                    class="h-2 w-2 bg-guinda-600 rounded-full"
                                ></div>
                            </div>
                            <p class="text-sm text-muted-foreground line-clamp-2">
                                {{ notification.data?.message || 'Sin mensaje' }}
                            </p>
                            <p class="text-xs text-muted-foreground mt-1">
                                {{ formatTimeAgo(notification.created_at) }}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="h-6 w-6 opacity-0 group-hover:opacity-100"
                            @click.stop="deleteNotification(notification)"
                        >
                            <Trash2 class="h-3 w-3" />
                        </Button>
                    </div>
                </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator v-if="notifications.length > 0" />

            <DropdownMenuItem v-if="notifications.length > 0" class="justify-center text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" as-child>
                    <a href="/notifications">Ver todas las notificaciones</a>
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <!-- Notification Detail Modal -->
    <Dialog v-model:open="showModal">
        <DialogContent class="sm:max-w-lg p-0 overflow-hidden rounded-xl border shadow-2xl">
            <!-- Header con color según tipo -->
            <div
                v-if="selectedNotification"
                class="px-6 pt-6 pb-4"
                :class="getTypeConfig(selectedNotification.data?.type).bg"
            >
                <div class="flex items-center gap-3 mb-2">
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        :class="[getTypeConfig(selectedNotification.data?.type).bg, getTypeConfig(selectedNotification.data?.type).border, 'border']"
                    >
                        <CheckCircle v-if="selectedNotification.data?.type === 'success'" class="h-5 w-5" :class="getTypeConfig(selectedNotification.data?.type).color" />
                        <AlertTriangle v-else-if="selectedNotification.data?.type === 'warning'" class="h-5 w-5" :class="getTypeConfig(selectedNotification.data?.type).color" />
                        <AlertCircle v-else-if="selectedNotification.data?.type === 'error'" class="h-5 w-5" :class="getTypeConfig(selectedNotification.data?.type).color" />
                        <Info v-else class="h-5 w-5" :class="getTypeConfig(selectedNotification.data?.type).color" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <DialogTitle class="text-base font-semibold leading-tight">
                            {{ selectedNotification.data?.title || 'Notificación' }}
                        </DialogTitle>
                        <span
                            class="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                            :class="[getTypeConfig(selectedNotification.data?.type).bg, getTypeConfig(selectedNotification.data?.type).color, getTypeConfig(selectedNotification.data?.type).border, 'border']"
                        >
                            {{ getTypeConfig(selectedNotification.data?.type).label }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Body -->
            <div v-if="selectedNotification" class="px-6 py-5 space-y-4">
                <DialogDescription class="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {{ selectedNotification.data?.message || 'Sin contenido' }}
                </DialogDescription>

                <div class="flex items-center gap-4 pt-3 border-t border-border/50">
                    <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock class="h-3.5 w-3.5" />
                        <span>{{ formatFullDate(selectedNotification.created_at) }}</span>
                    </div>
                    <div v-if="selectedNotification.read_at" class="flex items-center gap-1.5 text-xs text-emerald-500">
                        <Check class="h-3.5 w-3.5" />
                        <span>Leída</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <DialogFooter class="px-6 py-4 border-t border-border/50 bg-muted/30 sm:justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    class="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    @click="deleteAndClose"
                >
                    <Trash2 class="h-4 w-4 mr-1.5" />
                    Eliminar
                </Button>
                <Button
                    size="sm"
                    class="bg-guinda-600 hover:bg-guinda-700 text-white"
                    @click="showModal = false"
                >
                    Cerrar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
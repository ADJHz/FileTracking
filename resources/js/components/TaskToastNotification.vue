<script setup lang="ts">
import { X, Reply, CheckCircle, AlertTriangle, AlertCircle, Info, Clock, Flag, ArrowRightLeft } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action?: string;
    taskId?: string;
    userName?: string;
    timestamp: string;
}

const toasts = ref<ToastNotification[]>([]);
const MAX_TOASTS = 4;

const getTypeConfig = (type: string) => {
    switch (type) {
        case 'success': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', accent: 'border-l-emerald-500' };
        case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', accent: 'border-l-amber-500' };
        case 'error': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', accent: 'border-l-red-500' };
        default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', accent: 'border-l-blue-500' };
    }
};

const getActionIcon = (action?: string) => {
    switch (action) {
        case 'created': return { icon: CheckCircle, label: 'Nueva tarea' };
        case 'status_changed': return { icon: ArrowRightLeft, label: 'Estado cambiado' };
        case 'priority_changed': return { icon: Flag, label: 'Prioridad cambiada' };
        case 'deadline_warning': return { icon: Clock, label: 'Fecha límite próxima' };
        default: return { icon: Info, label: 'Actividad' };
    }
};

const formatTimeAgo = () => 'hace un momento';

const addToast = (toast: ToastNotification) => {
    // Remove oldest if at max
    if (toasts.value.length >= MAX_TOASTS) {
        toasts.value.pop();
    }
    toasts.value.unshift(toast);

    // Auto-remove after 8 seconds
    setTimeout(() => {
        removeToast(toast.id);
    }, 8000);
};

const removeToast = (id: string) => {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx > -1) {
        toasts.value.splice(idx, 1);
    }
};

const handleTaskActivity = ((event: CustomEvent) => {
    const data = event.detail;
    let type: 'info' | 'success' | 'warning' | 'error' = 'info';
    let title = 'Actividad de tarea';
    let message = '';

    switch (data.action) {
        case 'created':
            type = 'success';
            title = 'Nueva tarea creada';
            message = `${data.userName} creó la tarea ${data.task?.task_id}: ${data.task?.title}`;
            break;
        case 'status_changed':
            type = 'warning';
            title = 'Estado actualizado';
            message = `${data.userName} cambió ${data.task?.task_id} de "${data.oldValue}" a "${data.newValue}"`;
            break;
        case 'priority_changed':
            type = data.newValue === 'Urgente' ? 'error' : 'warning';
            title = 'Prioridad actualizada';
            message = `${data.userName} cambió la prioridad de ${data.task?.task_id} a "${data.newValue}"`;
            break;
        case 'deadline_warning':
            type = 'error';
            title = '⏰ Fecha límite próxima';
            message = `La tarea ${data.task?.task_id}: ${data.task?.title} vence mañana`;
            break;
        case 'deleted':
            type = 'error';
            title = 'Tarea eliminada';
            message = `${data.userName} eliminó la tarea ${data.task?.task_id}`;
            break;
        default:
            type = 'info';
            title = 'Tarea actualizada';
            message = `${data.userName} actualizó la tarea ${data.task?.task_id}`;
    }

    addToast({
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
        action: data.action,
        taskId: data.task?.task_id,
        userName: data.userName,
        timestamp: data.timestamp || new Date().toISOString(),
    });
}) as EventListener;

onMounted(() => {
    window.addEventListener('task-activity', handleTaskActivity);
});

onUnmounted(() => {
    window.removeEventListener('task-activity', handleTaskActivity);
});
</script>

<template>
    <!-- Toast Container - Fixed bottom-right -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 max-w-sm w-full pointer-events-none">
        <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0"
        >
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="pointer-events-auto w-full rounded-lg bg-background border border-border shadow-lg overflow-hidden border-l-4"
                :class="getTypeConfig(toast.type).accent"
            >
                <!-- Header -->
                <div class="flex items-center justify-between bg-muted/50 px-3 py-2">
                    <div class="flex items-center gap-2">
                        <component
                            :is="getActionIcon(toast.action).icon"
                            class="h-3.5 w-3.5"
                            :class="getTypeConfig(toast.type).color"
                        />
                        <span class="text-xs font-semibold text-foreground">
                            {{ getActionIcon(toast.action).label }}
                        </span>
                    </div>
                    <button
                        @click="removeToast(toast.id)"
                        class="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X class="h-3.5 w-3.5" />
                    </button>
                </div>

                <!-- Body -->
                <div class="px-3 py-2.5">
                    <div class="flex items-start gap-2.5">
                        <div
                            class="shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-0.5"
                            :class="getTypeConfig(toast.type).bg"
                        >
                            <component
                                :is="getTypeConfig(toast.type).icon"
                                class="h-4 w-4"
                                :class="getTypeConfig(toast.type).color"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-foreground leading-snug">
                                {{ toast.title }}
                            </p>
                            <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                {{ toast.message }}
                            </p>
                            <span class="text-xs text-muted-foreground/70 mt-1 block">
                                {{ formatTimeAgo() }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 px-3 pb-2.5">
                    <button
                        @click="removeToast(toast.id)"
                        class="flex-1 text-xs font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors"
                    >
                        Cerrar
                    </button>
                    <a
                        href="/tasks"
                        @click="removeToast(toast.id)"
                        class="flex-1 inline-flex items-center justify-center text-xs font-medium text-white bg-guinda-600 hover:bg-guinda-700 rounded-md px-3 py-1.5 transition-colors"
                    >
                        <Reply class="h-3 w-3 mr-1 -scale-x-100" />
                        Ver tarea
                    </a>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

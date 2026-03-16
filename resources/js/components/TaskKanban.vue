<script setup lang="ts">
import axios from 'axios';
import interact from 'interactjs';
import { CalendarDays, User as UserIcon } from 'lucide-vue-next';
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskStatus {
    id: number;
    name: string;
    color: string;
    order: number;
}

interface TaskType {
    id: number;
    name: string;
    color: string;
    order: number;
}

interface Area {
    id: number;
    name: string;
    color: string;
    icon: string | null;
    order: number;
}

interface TaskUser {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    task_id: string;
    title: string;
    description: string | null;
    status_id: number;
    type_id: number;
    area_id: number | null;
    assigned_to: number | null;
    created_by: number;
    priority: string;
    due_date: string | null;
    created_at: string;
    status: TaskStatus;
    type: TaskType;
    area: Area | null;
    assignee: TaskUser | null;
    creator: TaskUser;
}

const props = defineProps<{
    tasks: Task[];
    statuses: TaskStatus[];
}>();

const emit = defineEmits<{
    (e: 'task-updated', task: Task): void;
}>();

const draggingTaskId = ref<number | null>(null);
const hoverColumnId = ref<number | null>(null);
const localTasks = ref<Task[]>([]);

// Keep localTasks in sync with props, but allow optimistic mutations
watch(() => props.tasks, (newTasks) => {
    localTasks.value = [...newTasks];
}, { immediate: true, deep: true });

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    baja: { label: 'Baja', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    media: { label: 'Media', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    alta: { label: 'Alta', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40' },
    urgente: { label: 'Urgente', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
};

const tasksByStatus = computed(() => {
    const map: Record<number, Task[]> = {};
    props.statuses.forEach(s => { map[s.id] = []; });
    localTasks.value.forEach(t => {
        if (map[t.status_id]) {
            map[t.status_id].push(t);
        }
    });
    return map;
});

const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

const changeStatus = (taskId: number, newStatusId: number) => {
    // Optimistic update: move the card immediately in local state
    const task = localTasks.value.find(t => t.id === taskId);
    if (!task) return;
    const oldStatusId = task.status_id;
    const newStatus = props.statuses.find(s => s.id === newStatusId);
    task.status_id = newStatusId;
    if (newStatus) task.status = { ...newStatus };

    // Fire API in background — revert on failure
    axios.put(`/tasks/${taskId}`, { status_id: newStatusId })
        .then(({ data }) => emit('task-updated', data.task))
        .catch((error) => {
            console.error('Error al cambiar estado:', error);
            task.status_id = oldStatusId; // revert
        });
};

// Drag overlay: a clone rendered on top of everything
const dragClone = ref<HTMLElement | null>(null);

const setupInteract = () => {
    // Make task cards draggable
    interact('.kanban-card').draggable({
        inertia: false,
        autoScroll: true,
        listeners: {
            start(event) {
                const taskId = Number(event.target.dataset.taskId);
                draggingTaskId.value = taskId;

                // Hide the original card in place
                event.target.style.opacity = '0.3';

                // Create a fixed clone that floats above everything
                const rect = event.target.getBoundingClientRect();
                const clone = event.target.cloneNode(true) as HTMLElement;
                clone.style.position = 'fixed';
                clone.style.left = rect.left + 'px';
                clone.style.top = rect.top + 'px';
                clone.style.width = rect.width + 'px';
                clone.style.zIndex = '99999';
                clone.style.pointerEvents = 'none';
                clone.style.transform = 'rotate(2deg) scale(1.03)';
                clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
                clone.style.transition = 'none';
                clone.classList.add('ring-2', 'ring-primary');
                document.body.appendChild(clone);
                dragClone.value = clone;

                // Store initial position for the clone
                event.target.dataset.cloneX = String(rect.left);
                event.target.dataset.cloneY = String(rect.top);
            },
            move(event) {
                // Move the invisible original (for interact.js hit detection)
                const target = event.target;
                const x = (parseFloat(target.dataset.x as string) || 0) + event.dx;
                const y = (parseFloat(target.dataset.y as string) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.dataset.x = String(x);
                target.dataset.y = String(y);

                // Move the visible clone
                if (dragClone.value) {
                    const cx = parseFloat(target.dataset.cloneX!) + x;
                    const cy = parseFloat(target.dataset.cloneY!) + y;
                    dragClone.value.style.left = cx + 'px';
                    dragClone.value.style.top = cy + 'px';
                }
            },
            end(event) {
                const target = event.target;
                target.style.transform = '';
                target.style.opacity = '';
                target.dataset.x = '0';
                target.dataset.y = '0';

                // Remove the clone
                if (dragClone.value) {
                    dragClone.value.remove();
                    dragClone.value = null;
                }

                draggingTaskId.value = null;
                hoverColumnId.value = null;
            },
        },
    });

    // Make columns drop targets
    interact('.kanban-column').dropzone({
        accept: '.kanban-card',
        overlap: 0.25,
        ondragenter(event) {
            const statusId = Number(event.target.dataset.statusId);
            hoverColumnId.value = statusId;
        },
        ondragleave() {
            hoverColumnId.value = null;
        },
        ondrop(event) {
            const taskId = Number(event.relatedTarget.dataset.taskId);
            const newStatusId = Number(event.target.dataset.statusId);
            const task = props.tasks.find(t => t.id === taskId);
            hoverColumnId.value = null;
            if (task && task.status_id !== newStatusId) {
                changeStatus(taskId, newStatusId);
            }
        },
    });
};

onMounted(() => {
    nextTick(() => setupInteract());
});

onUnmounted(() => {
    interact('.kanban-card').unset();
    interact('.kanban-column').unset();
});
</script>

<template>
    <div class="kanban-board flex gap-4 overflow-x-auto pb-4" style="min-height: 500px;">
        <div
            v-for="status in statuses"
            :key="status.id"
            :data-status-id="status.id"
            class="kanban-column flex flex-col min-w-[280px] w-[280px] rounded-xl border-2 bg-card transition-all duration-200"
            :class="{
                'scale-[1.02] shadow-lg': hoverColumnId === status.id,
            }"
            :style="{
                borderColor: hoverColumnId === status.id ? status.color : 'transparent',
            }"
        >
            <!-- Column Header -->
            <div
                class="flex items-center justify-between px-4 py-3 rounded-t-xl"
                :style="{ backgroundColor: status.color + '22' }"
            >
                <div class="flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: status.color }" />
                    <span class="text-sm font-semibold text-foreground">{{ status.name }}</span>
                </div>
                <Badge variant="secondary" class="text-xs">
                    {{ tasksByStatus[status.id]?.length || 0 }}
                </Badge>
            </div>

            <!-- Task Cards -->
            <div class="flex flex-col gap-2 p-3 flex-1 overflow-y-auto">
                <div
                    v-for="task in tasksByStatus[status.id]"
                    :key="task.id"
                    :data-task-id="task.id"
                    class="kanban-card rounded-lg border bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md touch-none select-none"
                >
                    <!-- Card Header -->
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <span class="text-xs font-mono text-muted-foreground">{{ task.task_id }}</span>
                        <Badge
                            class="text-[10px] px-1.5 py-0 border-none font-medium"
                            :class="[priorityConfig[task.priority]?.color, priorityConfig[task.priority]?.bg]"
                        >
                            {{ priorityConfig[task.priority]?.label }}
                        </Badge>
                    </div>

                    <!-- Title -->
                    <p class="text-sm font-medium text-foreground leading-tight mb-2">{{ task.title }}</p>

                    <!-- Meta -->
                    <div class="flex items-center justify-between mt-auto">
                        <div class="flex items-center gap-2">
                            <TooltipProvider v-if="task.due_date">
                                <Tooltip>
                                    <TooltipTrigger as-child>
                                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                                            <CalendarDays class="h-3 w-3" />
                                            {{ formatDate(task.due_date) }}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Fecha límite</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Badge
                                v-if="task.type"
                                class="text-[10px] px-1.5 py-0 border-none text-white"
                                :style="{ backgroundColor: task.type.color }"
                            >
                                {{ task.type.name }}
                            </Badge>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Avatar class="h-6 w-6">
                                        <AvatarFallback
                                            v-if="task.assignee"
                                            class="bg-guinda-100 text-guinda-700 dark:bg-guinda-900/40 dark:text-guinda-300 text-[10px] font-medium"
                                        >
                                            {{ getInitials(task.assignee.name) }}
                                        </AvatarFallback>
                                        <AvatarFallback v-else class="bg-muted text-muted-foreground text-[10px]">
                                            <UserIcon class="h-3 w-3" />
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>{{ task.assignee?.name || 'Sin asignar' }}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <!-- Empty Column -->
                <div
                    v-if="!tasksByStatus[status.id]?.length"
                    class="flex flex-col items-center justify-center py-8 text-muted-foreground"
                >
                    <p class="text-xs">Sin tareas</p>
                </div>
            </div>
        </div>
    </div>
</template>


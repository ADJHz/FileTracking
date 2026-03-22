<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import axios from 'axios';
import {
    Plus, Search, Filter, ChevronDown, ChevronRight, Pencil, Trash2,
    CalendarDays, User as UserIcon, Flag, ListTodo, Clock, FolderOpen,
    BarChart3, CalendarRange, Loader2,
} from 'lucide-vue-next';
import { ref, shallowRef, computed, onMounted, onUnmounted } from 'vue';

// Lazy-loaded tab components
const KanbanComponent = shallowRef<any>(null);
const CalendarComponent = shallowRef<any>(null);
const kanbanLoading = ref(false);
const calendarioLoading = ref(false);

const loadKanban = () => {
    if (KanbanComponent.value || kanbanLoading.value) return;
    kanbanLoading.value = true;
    import('@/components/TaskKanban.vue').then(m => {
        KanbanComponent.value = m.default;
        kanbanLoading.value = false;
    });
};

const loadCalendar = () => {
    if (CalendarComponent.value || calendarioLoading.value) return;
    calendarioLoading.value = true;
    import('@/components/TaskCalendar.vue').then(m => {
        CalendarComponent.value = m.default;
        calendarioLoading.value = false;
    });
};
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

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
    types: TaskType[];
    areas: Area[];
    users: TaskUser[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel de Control', href: dashboard() },
    { title: 'Tareas Programadas', href: '/tasks' },
];

const loading = ref(true);
const allTasks = ref<Task[]>([...props.tasks]);
const searchQuery = ref('');
const filterStatus = ref<string>('all');
const filterType = ref<string>('all');
const filterArea = ref<string>('all');
const activeTab = ref<'tareas' | 'indicadores' | 'calendario'>('tareas');

const switchTab = (tab: 'tareas' | 'indicadores' | 'calendario') => {
    activeTab.value = tab;
    if (tab === 'indicadores') loadKanban();
    if (tab === 'calendario') loadCalendar();
};

const areaOpenState = ref<Record<number, boolean>>({});
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const saving = ref(false);
const taskToDelete = ref<Task | null>(null);

// Initialize all areas as open
props.areas.forEach(a => { areaOpenState.value[a.id] = true; });
areaOpenState.value[0] = true; // "Sin área" section

const emptyForm = {
    title: '',
    description: '',
    status_id: '',
    type_id: '',
    area_id: 'none',
    assigned_to: 'none',
    priority: 'media',
    due_date: '',
};

const form = ref({ ...emptyForm });
const editingTask = ref<Task | null>(null);

const filteredTasks = computed(() => {
    return allTasks.value.filter(t => {
        const matchesSearch = !searchQuery.value ||
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            t.task_id.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesStatus = filterStatus.value === 'all' || t.status_id === Number(filterStatus.value);
        const matchesType = filterType.value === 'all' || t.type_id === Number(filterType.value);
        const matchesArea = filterArea.value === 'all' || String(t.area_id || 0) === filterArea.value;
        return matchesSearch && matchesStatus && matchesType && matchesArea;
    });
});

// Group tasks by area
const tasksByArea = computed(() => {
    const groups: { area: Area | null; tasks: Task[] }[] = [];
    const areaMap = new Map<number, Task[]>();

    filteredTasks.value.forEach(t => {
        const areaId = t.area_id || 0;
        if (!areaMap.has(areaId)) {
            areaMap.set(areaId, []);
        }
        areaMap.get(areaId)!.push(t);
    });

    // Add real areas in order
    props.areas.forEach(area => {
        if (areaMap.has(area.id)) {
            groups.push({ area, tasks: areaMap.get(area.id)! });
        }
    });

    // Add "Sin área" group if any
    if (areaMap.has(0)) {
        groups.push({ area: null, tasks: areaMap.get(0)! });
    }

    return groups;
});

const activeFiltersCount = computed(() => {
    let count = 0;
    if (filterStatus.value !== 'all') count++;
    if (filterType.value !== 'all') count++;
    if (filterArea.value !== 'all') count++;
    return count;
});

const isTaskFormReady = computed(() => {
    return Boolean(form.value.title && form.value.status_id && form.value.type_id);
});

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    baja: { label: 'Baja', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    media: { label: 'Media', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    alta: { label: 'Alta', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40' },
    urgente: { label: 'Urgente', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
};

const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

const toggleArea = (areaId: number) => {
    areaOpenState.value[areaId] = !areaOpenState.value[areaId];
};

const openCreate = () => {
    form.value = { ...emptyForm };
    showCreateDialog.value = true;
};

const openEdit = (task: Task) => {
    editingTask.value = task;
    form.value = {
        title: task.title,
        description: task.description || '',
        status_id: String(task.status_id),
        type_id: String(task.type_id),
        area_id: task.area_id ? String(task.area_id) : 'none',
        assigned_to: task.assigned_to ? String(task.assigned_to) : 'none',
        priority: task.priority,
        due_date: task.due_date || '',
    };
    showEditDialog.value = true;
};

const confirmDelete = (task: Task) => {
    taskToDelete.value = task;
    showDeleteDialog.value = true;
};

const createTask = async () => {
    saving.value = true;
    try {
        const payload = {
            ...form.value,
            status_id: Number(form.value.status_id),
            type_id: Number(form.value.type_id),
            area_id: form.value.area_id !== 'none' ? Number(form.value.area_id) : null,
            assigned_to: form.value.assigned_to && form.value.assigned_to !== 'none' ? Number(form.value.assigned_to) : null,
            due_date: form.value.due_date || null,
            description: form.value.description || null,
        };
        const { data } = await axios.post('/tasks', payload);
        if (!allTasks.value.some(t => t.id === data.task.id)) {
            allTasks.value.unshift(data.task);
        }
        showCreateDialog.value = false;
    } catch (error) {
        console.error('Error al crear tarea:', error);
    } finally {
        saving.value = false;
    }
};

const updateTask = async () => {
    if (!editingTask.value) return;
    saving.value = true;
    try {
        const payload = {
            ...form.value,
            status_id: Number(form.value.status_id),
            type_id: Number(form.value.type_id),
            area_id: form.value.area_id !== 'none' ? Number(form.value.area_id) : null,
            assigned_to: form.value.assigned_to && form.value.assigned_to !== 'none' ? Number(form.value.assigned_to) : null,
            due_date: form.value.due_date || null,
            description: form.value.description || null,
        };
        const { data } = await axios.put(`/tasks/${editingTask.value.id}`, payload);
        const idx = allTasks.value.findIndex(t => t.id === editingTask.value!.id);
        if (idx > -1) {
            allTasks.value[idx] = { ...allTasks.value[idx], ...data.task };
        }
        showEditDialog.value = false;
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    } finally {
        saving.value = false;
    }
};

const deleteTask = async () => {
    if (!taskToDelete.value) return;
    saving.value = true;
    try {
        await axios.delete(`/tasks/${taskToDelete.value.id}`);
        allTasks.value = allTasks.value.filter(t => t.id !== taskToDelete.value!.id);
        showDeleteDialog.value = false;
        taskToDelete.value = null;
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    } finally {
        saving.value = false;
    }
};

// Handle Kanban task updated (drag-drop status change)
const onKanbanTaskUpdated = (updatedTask: Task) => {
    const idx = allTasks.value.findIndex(t => t.id === updatedTask.id);
    if (idx > -1) {
        allTasks.value[idx] = { ...allTasks.value[idx], ...updatedTask };
    }
};

// Real-time task activity listener
const handleTaskActivity = ((event: CustomEvent) => {
    const data = event.detail;
    if (data.action === 'created' && data.task) {
        if (!allTasks.value.some(t => t.id === data.task.id)) {
            allTasks.value.unshift(data.task);
        }
    } else if (data.action === 'deleted' && data.task) {
        allTasks.value = allTasks.value.filter(t => t.id !== data.task.id);
    } else if (data.task) {
        const idx = allTasks.value.findIndex(t => t.id === data.task.id);
        if (idx > -1) {
            allTasks.value[idx] = data.task;
        }
    }
}) as EventListener;

const handleTasksSynced = ((event: CustomEvent) => {
    const payload = event.detail?.payload;
    if (payload?.tasks && Array.isArray(payload.tasks)) {
        allTasks.value = [...payload.tasks];
    }
}) as EventListener;

onMounted(() => {
    setTimeout(() => { loading.value = false; }, 400);
    window.addEventListener('task-activity', handleTaskActivity);
    window.addEventListener('tasks-synced', handleTasksSynced);
});

onUnmounted(() => {
    window.removeEventListener('task-activity', handleTaskActivity);
    window.removeEventListener('tasks-synced', handleTasksSynced);
});
</script>

<template>
    <Head title="Tareas Programadas" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
            <!-- Header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Tareas Programadas</h1>
                    <p class="text-sm text-muted-foreground mt-1">Gestión de tareas, documentos y expedientes</p>
                </div>
                <Button @click="openCreate" class="gap-2 bg-guinda-600 hover:bg-guinda-700 text-white">
                    <Plus class="h-4 w-4" />
                    Agregar tarea
                </Button>
            </div>

            <!-- Tabs -->
            <div class="rounded-lg bg-muted/50 p-1 inline-flex gap-1">
                <button
                    @click="switchTab('tareas')"
                    :class="[
                        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                        activeTab === 'tareas'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-400/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    ]"
                >
                    <ListTodo class="h-4 w-4" />
                    Tareas Programadas
                </button>
                <button
                    @click="switchTab('indicadores')"
                    :class="[
                        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                        activeTab === 'indicadores'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-400/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    ]"
                >
                    <BarChart3 class="h-4 w-4" />
                    Indicadores
                </button>
                <button
                    @click="switchTab('calendario')"
                    :class="[
                        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                        activeTab === 'calendario'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-400/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    ]"
                >
                    <CalendarRange class="h-4 w-4" />
                    Calendario
                </button>
            </div>

            <!-- Tab: Tareas Programadas -->
            <template v-if="activeTab === 'tareas'">

            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px] max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        v-model="searchQuery"
                        placeholder="Buscar tarea..."
                        class="pl-9"
                    />
                </div>
                <Select v-model="filterStatus">
                    <SelectTrigger class="w-[180px]">
                        <Filter class="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem v-for="s in statuses" :key="s.id" :value="String(s.id)">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: s.color }" />
                                {{ s.name }}
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="filterType">
                    <SelectTrigger class="w-[180px]">
                        <ListTodo class="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem v-for="tp in types" :key="tp.id" :value="String(tp.id)">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: tp.color }" />
                                {{ tp.name }}
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="filterArea">
                    <SelectTrigger class="w-[180px]">
                        <FolderOpen class="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las áreas</SelectItem>
                        <SelectItem value="0">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full bg-border" />
                                Sin área
                            </div>
                        </SelectItem>
                        <SelectItem v-for="a in areas" :key="a.id" :value="String(a.id)">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: a.color }" />
                                {{ a.name }}
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Badge
                    v-if="activeFiltersCount > 0"
                    class="bg-guinda-100 text-guinda-700 dark:bg-guinda-900/40 dark:text-guinda-300 border-none cursor-pointer"
                    @click="filterStatus = 'all'; filterType = 'all'; filterArea = 'all'"
                >
                    {{ activeFiltersCount }} filtro(s) · Limpiar
                </Badge>
            </div>

            <!-- Total summary -->
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{{ filteredTasks.length }} tareas</span>
            </div>

            <!-- Area-based Task Boards -->
            <div class="flex flex-col gap-4">
                <template v-if="tasksByArea.length === 0 && !loading">
                    <Card>
                        <CardContent class="py-12">
                            <div class="flex flex-col items-center justify-center">
                                <div class="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <ListTodo class="h-7 w-7 text-muted-foreground" />
                                </div>
                                <p class="text-sm font-medium text-foreground mb-1">Sin tareas</p>
                                <p class="text-xs text-muted-foreground">Crea una nueva tarea para comenzar</p>
                            </div>
                        </CardContent>
                    </Card>
                </template>

                <Card v-for="group in tasksByArea" :key="group.area?.id ?? 0" class="overflow-hidden">
                    <CardHeader class="flex-row items-center justify-between border-b bg-muted/30 py-3 px-4">
                        <div class="flex items-center gap-2 cursor-pointer select-none" @click="toggleArea(group.area?.id ?? 0)">
                            <component :is="areaOpenState[group.area?.id ?? 0] ? ChevronDown : ChevronRight" class="h-4 w-4 text-muted-foreground" />
                            <span
                                class="h-3 w-3 rounded-full shrink-0"
                                :style="{ backgroundColor: group.area?.color || '#9ca3af' }"
                            />
                            <CardTitle class="text-sm font-semibold">{{ group.area?.name || 'Sin área asignada' }}</CardTitle>
                            <Badge variant="outline" class="text-xs ml-2">{{ group.tasks.length }} tareas</Badge>
                        </div>

                    </CardHeader>

                    <CardContent v-if="areaOpenState[group.area?.id ?? 0]" class="p-0">
                        <!-- Table Header -->
                        <div class="grid grid-cols-[1fr_80px_140px_140px_120px_60px] gap-0 border-b bg-muted/20 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <div>Tarea</div>
                            <div class="text-center">Resp.</div>
                            <div class="text-center">Estado</div>
                            <div class="text-center">Tipo</div>
                            <div class="text-center">ID de tarea</div>
                            <div></div>
                        </div>

                        <!-- Skeleton Loading -->
                        <template v-if="loading">
                            <div
                                v-for="n in 3"
                                :key="n"
                                class="grid grid-cols-[1fr_80px_140px_140px_120px_60px] gap-0 items-center border-b px-4 py-3"
                            >
                                <div class="flex items-center gap-3">
                                    <Skeleton class="h-4 w-4" />
                                    <Skeleton class="h-4 w-48" />
                                </div>
                                <div class="flex justify-center"><Skeleton class="h-8 w-8 rounded-full" /></div>
                                <div class="flex justify-center"><Skeleton class="h-6 w-24 rounded-full" /></div>
                                <div class="flex justify-center"><Skeleton class="h-6 w-20 rounded-full" /></div>
                                <div class="flex justify-center"><Skeleton class="h-4 w-16" /></div>
                                <div></div>
                            </div>
                        </template>

                        <!-- Task Rows -->
                        <template v-else>
                        <div
                            v-for="task in group.tasks"
                            :key="task.id"
                            class="grid grid-cols-[1fr_80px_140px_140px_120px_60px] gap-0 items-center border-b px-4 py-3 transition-colors hover:bg-accent/40 group"
                        >
                            <!-- Title -->
                            <div class="flex items-center gap-3 min-w-0">
                                <Flag
                                    class="h-4 w-4 shrink-0"
                                    :class="priorityConfig[task.priority]?.color || 'text-muted-foreground'"
                                />
                                <span class="truncate text-sm font-medium text-foreground">{{ task.title }}</span>
                                <TooltipProvider v-if="task.due_date">
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <span class="shrink-0 text-xs text-muted-foreground flex items-center gap-1">
                                                <CalendarDays class="h-3 w-3" />
                                                {{ formatDate(task.due_date) }}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>Fecha límite</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <!-- Assignee -->
                            <div class="flex justify-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <Avatar class="h-8 w-8">
                                                <AvatarFallback
                                                    v-if="task.assignee"
                                                    class="bg-guinda-100 text-guinda-700 dark:bg-guinda-900/40 dark:text-guinda-300 text-xs font-medium"
                                                >
                                                    {{ getInitials(task.assignee.name) }}
                                                </AvatarFallback>
                                                <AvatarFallback v-else class="bg-muted text-muted-foreground text-xs">
                                                    <UserIcon class="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>{{ task.assignee?.name || 'Sin asignar' }}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <!-- Status -->
                            <div class="flex justify-center">
                                <Badge
                                    class="rounded-full px-3 py-1 text-xs font-semibold border-none text-white"
                                    :style="{ backgroundColor: task.status.color }"
                                >
                                    {{ task.status.name }}
                                </Badge>
                            </div>

                            <!-- Type -->
                            <div class="flex justify-center">
                                <Badge
                                    class="rounded-full px-3 py-1 text-xs font-semibold border-none text-white"
                                    :style="{ backgroundColor: task.type.color }"
                                >
                                    {{ task.type.name }}
                                </Badge>
                            </div>

                            <!-- Task ID -->
                            <div class="text-center">
                                <span class="text-xs font-mono text-muted-foreground">{{ task.task_id }}</span>
                            </div>

                            <!-- Actions -->
                            <div class="flex justify-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" size="sm" class="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span class="sr-only">Acciones</span>
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="openEdit(task)" class="gap-2 cursor-pointer">
                                            <Pencil class="h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="confirmDelete(task)" class="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                                            <Trash2 class="h-4 w-4" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <!-- Empty -->
                        <div v-if="group.tasks.length === 0" class="flex flex-col items-center justify-center py-12">
                            <div class="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
                                <ListTodo class="h-7 w-7 text-muted-foreground" />
                            </div>
                            <p class="text-sm font-medium text-foreground mb-1">Sin tareas en esta área</p>
                            <p class="text-xs text-muted-foreground">Crea una nueva tarea para comenzar</p>
                        </div>
                    </template>

                    <!-- Footer Summary -->
                    <div v-if="!loading && group.tasks.length > 0" class="grid grid-cols-[1fr_80px_140px_140px_120px_60px] gap-0 items-center bg-muted/30 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        <div></div>
                        <div></div>
                        <!-- Status summary pills -->
                        <div class="flex justify-center gap-1 flex-wrap">
                            <span
                                v-for="s in statuses"
                                :key="s.id"
                                class="h-3 w-5 rounded-sm"
                                :style="{ backgroundColor: s.color, opacity: group.tasks.some(t => t.status_id === s.id) ? '1' : '0.25' }"
                            />
                        </div>
                        <!-- Type summary pills -->
                        <div class="flex justify-center gap-1 flex-wrap">
                            <span
                                v-for="tp in types"
                                :key="tp.id"
                                class="h-3 w-5 rounded-sm"
                                :style="{ backgroundColor: tp.color, opacity: group.tasks.some(t => t.type_id === tp.id) ? '1' : '0.25' }"
                            />
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </CardContent>
            </Card>
            </div>

            </template>

            <!-- Tab: Indicadores (Kanban) — lazy loaded -->
            <template v-if="activeTab === 'indicadores'">
                <!-- Skeleton while chunk loads -->
                <div v-if="!KanbanComponent" class="flex flex-col gap-4" style="min-height: 500px;">
                    <div class="flex items-center justify-center gap-2 py-3">
                        <Loader2 class="h-5 w-5 animate-spin text-guinda-600" />
                        <span class="text-sm text-muted-foreground">Cargando indicadores...</span>
                    </div>
                    <div class="flex gap-4 overflow-hidden">
                        <div v-for="n in 4" :key="n" class="flex flex-col min-w-[280px] w-[280px] rounded-xl border bg-card">
                            <div class="flex items-center justify-between px-4 py-3 rounded-t-xl bg-muted/30">
                                <div class="flex items-center gap-2">
                                    <Skeleton class="h-3 w-3 rounded-full" />
                                    <Skeleton class="h-4 w-24" />
                                </div>
                                <Skeleton class="h-5 w-6 rounded-full" />
                            </div>
                            <div class="flex flex-col gap-2 p-3">
                                <div v-for="m in (n % 2 === 0 ? 2 : 3)" :key="m" class="rounded-lg border bg-background p-3 space-y-2">
                                    <div class="flex items-center justify-between">
                                        <Skeleton class="h-3 w-16" />
                                        <Skeleton class="h-4 w-12 rounded-full" />
                                    </div>
                                    <Skeleton class="h-4 w-full" />
                                    <Skeleton class="h-3 w-3/4" />
                                    <div class="flex items-center justify-between pt-1">
                                        <Skeleton class="h-3 w-16" />
                                        <Skeleton class="h-6 w-6 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <component
                    v-else
                    :is="KanbanComponent"
                    :tasks="filteredTasks"
                    :statuses="statuses"
                    @task-updated="onKanbanTaskUpdated"
                />
            </template>

            <!-- Tab: Calendario — lazy loaded -->
            <template v-if="activeTab === 'calendario'">
                <!-- Skeleton while chunk loads -->
                <div v-if="!CalendarComponent" class="flex flex-col gap-4">
                    <div class="flex items-center justify-center gap-2 py-3">
                        <Loader2 class="h-5 w-5 animate-spin text-guinda-600" />
                        <span class="text-sm text-muted-foreground">Cargando calendario...</span>
                    </div>
                    <div class="rounded-xl border bg-card overflow-hidden">
                        <div class="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                            <div class="flex items-center gap-2">
                                <Skeleton class="h-8 w-8 rounded-md" />
                                <Skeleton class="h-8 w-16 rounded-md" />
                                <Skeleton class="h-8 w-8 rounded-md" />
                            </div>
                            <Skeleton class="h-5 w-40" />
                            <div class="flex items-center gap-2">
                                <Skeleton class="h-8 w-14 rounded-md" />
                                <Skeleton class="h-8 w-14 rounded-md" />
                                <Skeleton class="h-8 w-14 rounded-md" />
                            </div>
                        </div>
                        <div class="grid grid-cols-7 border-b">
                            <div v-for="d in 7" :key="d" class="p-2 flex justify-center">
                                <Skeleton class="h-4 w-8" />
                            </div>
                        </div>
                        <div v-for="row in 5" :key="row" class="grid grid-cols-7 border-b last:border-b-0">
                            <div v-for="col in 7" :key="col" class="border-r last:border-r-0 p-2 min-h-[80px]">
                                <Skeleton class="h-4 w-5 mb-2" />
                                <Skeleton v-if="(row + col) % 3 === 0" class="h-4 w-full rounded-sm mb-1" />
                                <Skeleton v-if="(row * col) % 5 === 0" class="h-4 w-3/4 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>
                <component
                    v-else
                    :is="CalendarComponent"
                    :tasks="filteredTasks"
                />
            </template>
        </div>

        <!-- Create Task Dialog -->
        <Dialog :open="showCreateDialog" @update:open="showCreateDialog = $event">
            <DialogContent class="sm:max-w-lg">
                <template v-if="showCreateDialog">
                <DialogHeader>
                    <DialogTitle>Nueva Tarea</DialogTitle>
                    <DialogDescription>Completa los datos para crear una nueva tarea programada.</DialogDescription>
                </DialogHeader>
                <form @submit.prevent="createTask" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="title">Título <span class="text-red-500">*</span></Label>
                        <Input id="title" v-model="form.title" placeholder="Nombre de la tarea" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="description">Descripción</Label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            rows="2"
                            placeholder="Descripción opcional..."
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Estado <span class="text-red-500">*</span></Label>
                            <Select v-model="form.status_id" required>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="s in statuses" :key="s.id" :value="String(s.id)">
                                        <div class="flex items-center gap-2">
                                            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: s.color }" />
                                            {{ s.name }}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Tipo <span class="text-red-500">*</span></Label>
                            <Select v-model="form.type_id" required>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="tp in types" :key="tp.id" :value="String(tp.id)">
                                        <div class="flex items-center gap-2">
                                            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: tp.color }" />
                                            {{ tp.name }}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>Área <span class="text-xs font-normal text-muted-foreground">(opcional)</span></Label>
                        <Select v-model="form.area_id">
                            <SelectTrigger><SelectValue placeholder="Seleccionar área (opcional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin área</SelectItem>
                                <SelectItem v-for="a in areas" :key="a.id" :value="String(a.id)">
                                    <div class="flex items-center gap-2">
                                        <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: a.color }" />
                                        {{ a.name }}
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Responsable</Label>
                            <Select v-model="form.assigned_to">
                                <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin asignar</SelectItem>
                                    <SelectItem v-for="u in users" :key="u.id" :value="String(u.id)">
                                        {{ u.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Prioridad <span class="text-red-500">*</span></Label>
                            <Select v-model="form.priority" required>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baja">🔵 Baja</SelectItem>
                                    <SelectItem value="media">🟡 Media</SelectItem>
                                    <SelectItem value="alta">🟠 Alta</SelectItem>
                                    <SelectItem value="urgente">🔴 Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="due">Fecha límite</Label>
                        <Input id="due" v-model="form.due_date" type="date" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="showCreateDialog = false">Cancelar</Button>
                        <Button type="submit" :disabled="saving || !isTaskFormReady" class="bg-guinda-600 hover:bg-guinda-700 text-white">
                            <Clock v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                            Crear Tarea
                        </Button>
                    </DialogFooter>
                </form>
                </template>
            </DialogContent>
        </Dialog>

        <!-- Edit Task Dialog -->
        <Dialog :open="showEditDialog" @update:open="showEditDialog = $event">
            <DialogContent class="sm:max-w-lg">
                <template v-if="showEditDialog">
                <DialogHeader>
                    <DialogTitle>Editar Tarea</DialogTitle>
                    <DialogDescription>Modifica los datos de la tarea <span class="font-mono font-semibold">{{ editingTask?.task_id }}</span></DialogDescription>
                </DialogHeader>
                <form @submit.prevent="updateTask" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="edit-title">Título <span class="text-red-500">*</span></Label>
                        <Input id="edit-title" v-model="form.title" placeholder="Nombre de la tarea" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="edit-description">Descripción</Label>
                        <textarea
                            id="edit-description"
                            v-model="form.description"
                            rows="2"
                            placeholder="Descripción opcional..."
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Estado <span class="text-red-500">*</span></Label>
                            <Select v-model="form.status_id" required>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="s in statuses" :key="s.id" :value="String(s.id)">
                                        <div class="flex items-center gap-2">
                                            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: s.color }" />
                                            {{ s.name }}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Tipo <span class="text-red-500">*</span></Label>
                            <Select v-model="form.type_id" required>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="tp in types" :key="tp.id" :value="String(tp.id)">
                                        <div class="flex items-center gap-2">
                                            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: tp.color }" />
                                            {{ tp.name }}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>Área <span class="text-xs font-normal text-muted-foreground">(opcional)</span></Label>
                        <Select v-model="form.area_id">
                            <SelectTrigger><SelectValue placeholder="Seleccionar área (opcional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin área</SelectItem>
                                <SelectItem v-for="a in areas" :key="a.id" :value="String(a.id)">
                                    <div class="flex items-center gap-2">
                                        <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: a.color }" />
                                        {{ a.name }}
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Responsable</Label>
                            <Select v-model="form.assigned_to">
                                <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin asignar</SelectItem>
                                    <SelectItem v-for="u in users" :key="u.id" :value="String(u.id)">
                                        {{ u.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label>Prioridad <span class="text-red-500">*</span></Label>
                            <Select v-model="form.priority" required>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baja">🔵 Baja</SelectItem>
                                    <SelectItem value="media">🟡 Media</SelectItem>
                                    <SelectItem value="alta">🟠 Alta</SelectItem>
                                    <SelectItem value="urgente">🔴 Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="edit-due">Fecha límite</Label>
                        <Input id="edit-due" v-model="form.due_date" type="date" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="showEditDialog = false">Cancelar</Button>
                        <Button type="submit" :disabled="saving || !isTaskFormReady" class="bg-guinda-600 hover:bg-guinda-700 text-white">
                            <Clock v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
                </template>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
            <DialogContent class="sm:max-w-md">
                <template v-if="showDeleteDialog">
                <DialogHeader>
                    <DialogTitle>Eliminar Tarea</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de eliminar la tarea <span class="font-mono font-semibold">{{ taskToDelete?.task_id }}</span> — "{{ taskToDelete?.title }}"?
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="showDeleteDialog = false">Cancelar</Button>
                    <Button variant="destructive" :disabled="saving" @click="deleteTask">
                        <Trash2 v-if="!saving" class="mr-2 h-4 w-4" />
                        <Clock v-else class="mr-2 h-4 w-4 animate-spin" />
                        Eliminar
                    </Button>
                </DialogFooter>
                </template>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>

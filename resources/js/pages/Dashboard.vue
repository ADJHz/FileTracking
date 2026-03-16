<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    Users, Bell, BellOff, Activity, TrendingUp, TrendingDown,
    ClipboardList, CheckCircle2, Timer, AlertTriangle, CalendarClock, Flag,
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';

import { BarChart, AreaChart, DonutChart } from '@/components/charts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface ChartDataItem {
    label: string;
    value: number;
    color?: string;
}

interface RecentActivityItem {
    id: number;
    description: string;
    event: string;
    created_at: string;
}

interface UpcomingDeadline {
    id: number;
    task_id: string;
    title: string;
    due_date: string;
    due_label: string;
    priority: string;
    status_name: string;
    status_color: string;
    assignee_name: string | null;
}

const props = defineProps<{
    stats: {
        totalUsers: number;
        totalNotifications: number;
        unreadNotifications: number;
        todayActivity: number;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        overdueTasks: number;
    };
    tasksByStatus: ChartDataItem[];
    tasksByPriority: ChartDataItem[];
    tasksPerDay: ChartDataItem[];
    upcomingDeadlines: UpcomingDeadline[];
    activityPerDay: ChartDataItem[];
    notificationsPerDay: ChartDataItem[];
    notificationBreakdown: ChartDataItem[];
    activityByEvent: ChartDataItem[];
    recentActivity: RecentActivityItem[];
}>();

const loading = ref(true);
const liveStats = ref({ ...props.stats });
const liveNotificationsPerDay = ref([...props.notificationsPerDay]);
const liveNotificationBreakdown = ref([...props.notificationBreakdown]);
const liveActivityPerDay = ref([...props.activityPerDay]);
const liveActivityByEvent = ref([...props.activityByEvent]);
const liveRecentActivity = ref([...props.recentActivity]);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel de Control', href: dashboard() },
];

const completionPercent = computed(() => {
    if (liveStats.value.totalTasks === 0) return 0;
    return Math.round((liveStats.value.completedTasks / liveStats.value.totalTasks) * 100);
});

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    baja: { label: 'Baja', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
    media: { label: 'Media', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    alta: { label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/40' },
    urgente: { label: 'Urgente', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/40' },
};

const taskStatCards = computed(() => [
    {
        title: 'Total Tareas',
        value: liveStats.value.totalTasks,
        icon: ClipboardList,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
        title: 'Completadas',
        value: liveStats.value.completedTasks,
        icon: CheckCircle2,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        subtitle: completionPercent.value + '%',
    },
    {
        title: 'En Progreso',
        value: liveStats.value.inProgressTasks,
        icon: Timer,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
        title: 'Vencidas',
        value: liveStats.value.overdueTasks,
        icon: AlertTriangle,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        alert: liveStats.value.overdueTasks > 0,
    },
]);

const secondaryStatCards = computed(() => [
    {
        title: 'Usuarios',
        value: liveStats.value.totalUsers,
        icon: Users,
        color: 'text-chart-1',
        bg: 'bg-chart-1/10',
    },
    {
        title: 'Notificaciones',
        value: liveStats.value.totalNotifications,
        icon: Bell,
        color: 'text-chart-2',
        bg: 'bg-chart-2/10',
    },
    {
        title: 'Sin Leer',
        value: liveStats.value.unreadNotifications,
        icon: BellOff,
        color: 'text-chart-3',
        bg: 'bg-chart-3/10',
    },
    {
        title: 'Actividad Hoy',
        value: liveStats.value.todayActivity,
        icon: Activity,
        color: 'text-chart-4',
        bg: 'bg-chart-4/10',
    },
]);

// Status chart colors from backend data
const statusChartColors = computed(() =>
    props.tasksByStatus.map(s => s.color || 'var(--chart-1)')
);

const handleDashboardUpdated = ((event: CustomEvent) => {
    const data = event.detail;
    if (data.stats) liveStats.value = { ...liveStats.value, ...data.stats };
    if (data.notificationsPerDay) liveNotificationsPerDay.value = [...data.notificationsPerDay];
    if (data.notificationBreakdown) liveNotificationBreakdown.value = [...data.notificationBreakdown];
}) as EventListener;

onMounted(() => {
    window.addEventListener('dashboard-updated', handleDashboardUpdated);
    setTimeout(() => { loading.value = false; }, 500);
});

onUnmounted(() => {
    window.removeEventListener('dashboard-updated', handleDashboardUpdated);
});
</script>

<template>
    <Head title="Panel de Control" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

            <!-- Row 1: Task KPI Cards -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <template v-if="loading">
                    <Card v-for="n in 4" :key="n">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton class="h-4 w-24" />
                            <Skeleton class="h-9 w-9 rounded-lg" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton class="h-8 w-16 mb-1" />
                            <Skeleton class="h-3 w-12" />
                        </CardContent>
                    </Card>
                </template>
                <template v-else>
                    <Card
                        v-for="stat in taskStatCards"
                        :key="stat.title"
                        :class="{ 'ring-1 ring-red-300 dark:ring-red-800': stat.alert }"
                    >
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardDescription class="text-sm font-medium">{{ stat.title }}</CardDescription>
                            <div :class="[stat.bg, 'rounded-lg p-2']">
                                <component :is="stat.icon" :class="[stat.color, 'h-5 w-5']" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div class="text-3xl font-bold">{{ stat.value }}</div>
                            <p v-if="stat.subtitle" class="text-xs text-muted-foreground mt-0.5">{{ stat.subtitle }} del total</p>
                        </CardContent>
                    </Card>
                </template>
            </div>

            <!-- Row 2: Task Charts -->
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Tasks Created per Day -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <TrendingUp class="h-4 w-4 text-blue-500" />
                            <CardTitle class="text-base">Tareas Creadas</CardTitle>
                        </div>
                        <CardDescription>Tareas creadas en los últimos 7 días</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="flex items-end gap-2" style="height: 220px">
                                <Skeleton v-for="n in 7" :key="n" class="flex-1 rounded-t-md" :style="{ height: `${25 + Math.random() * 55}%` }" />
                            </div>
                        </template>
                        <BarChart v-else :data="tasksPerDay" :height="220" />
                    </CardContent>
                </Card>

                <!-- Tasks by Status Donut -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <ClipboardList class="h-4 w-4 text-emerald-500" />
                            <CardTitle class="text-base">Tareas por Estado</CardTitle>
                        </div>
                        <CardDescription>Distribución actual de tareas por estado</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="flex items-center justify-center py-4">
                                <Skeleton class="rounded-full" style="width: 200px; height: 200px" />
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex items-center gap-6">
                                <DonutChart
                                    v-if="tasksByStatus.some(s => s.value > 0)"
                                    :data="tasksByStatus"
                                    :size="200"
                                    :thickness="32"
                                    :colors="statusChartColors"
                                />
                                <div v-else class="flex items-center justify-center w-[200px] h-[200px]">
                                    <p class="text-muted-foreground text-sm">Sin tareas</p>
                                </div>
                                <!-- Legend -->
                                <div class="flex flex-col gap-2 text-sm min-w-0">
                                    <div
                                        v-for="item in tasksByStatus"
                                        :key="item.label"
                                        class="flex items-center gap-2"
                                    >
                                        <span class="h-2.5 w-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }" />
                                        <span class="truncate text-muted-foreground">{{ item.label }}</span>
                                        <span class="font-semibold ml-auto">{{ item.value }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </div>

            <!-- Row 3: Priority Chart + Upcoming Deadlines -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Tasks by Priority -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <Flag class="h-4 w-4 text-orange-500" />
                            <CardTitle class="text-base">Tareas por Prioridad</CardTitle>
                        </div>
                        <CardDescription>Distribución de prioridades</CardDescription>
                    </CardHeader>
                    <CardContent class="flex items-center justify-center">
                        <Skeleton v-if="loading" class="rounded-full" style="width: 180px; height: 180px" />
                        <template v-else>
                            <DonutChart
                                v-if="tasksByPriority.some(p => p.value > 0)"
                                :data="tasksByPriority"
                                :size="180"
                                :thickness="28"
                                :colors="['#3b82f6', '#f59e0b', '#f97316', '#ef4444']"
                            />
                            <p v-else class="text-muted-foreground text-sm">Sin tareas</p>
                        </template>
                    </CardContent>
                </Card>

                <!-- Upcoming Deadlines -->
                <Card class="lg:col-span-2">
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <CalendarClock class="h-4 w-4 text-amber-500" />
                            <CardTitle class="text-base">Próximos Vencimientos</CardTitle>
                        </div>
                        <CardDescription>Tareas con fecha límite en los próximos 7 días</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="space-y-3">
                                <div v-for="n in 4" :key="n" class="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                    <Skeleton class="h-8 w-8 rounded-lg" />
                                    <div class="flex-1 space-y-1.5">
                                        <Skeleton class="h-4 w-3/4" />
                                        <div class="flex gap-2">
                                            <Skeleton class="h-4 w-16 rounded-full" />
                                            <Skeleton class="h-4 w-20 rounded-full" />
                                        </div>
                                    </div>
                                    <Skeleton class="h-5 w-14" />
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="upcomingDeadlines.length" class="space-y-3">
                                <div
                                    v-for="task in upcomingDeadlines"
                                    :key="task.id"
                                    class="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                                >
                                    <div
                                        class="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                                        :class="priorityConfig[task.priority]?.bg || 'bg-muted'"
                                    >
                                        <Flag class="h-4 w-4" :class="priorityConfig[task.priority]?.color || 'text-muted-foreground'" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-mono text-muted-foreground">{{ task.task_id }}</span>
                                            <p class="truncate text-sm font-medium">{{ task.title }}</p>
                                        </div>
                                        <div class="flex items-center gap-2 mt-0.5">
                                            <Badge
                                                class="text-[10px] px-1.5 py-0 border-none text-white"
                                                :style="{ backgroundColor: task.status_color }"
                                            >
                                                {{ task.status_name }}
                                            </Badge>
                                            <span v-if="task.assignee_name" class="text-xs text-muted-foreground">{{ task.assignee_name }}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        :class="[
                                            'text-xs font-semibold shrink-0',
                                            task.due_label === 'Hoy'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-none'
                                                : task.due_label === 'Mañana'
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-none'
                                                    : 'bg-muted text-muted-foreground border-none'
                                        ]"
                                    >
                                        {{ task.due_label }}
                                    </Badge>
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-8">
                                <CheckCircle2 class="text-emerald-500 mb-2 h-8 w-8" />
                                <p class="text-muted-foreground text-sm">Sin vencimientos próximos</p>
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </div>

            <!-- Row 4: System Cards (secondary) -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <template v-if="loading">
                    <Card v-for="n in 4" :key="n">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton class="h-4 w-20" />
                            <Skeleton class="h-8 w-8 rounded-lg" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton class="h-7 w-14" />
                        </CardContent>
                    </Card>
                </template>
                <template v-else>
                    <Card v-for="stat in secondaryStatCards" :key="stat.title">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardDescription class="text-sm font-medium">{{ stat.title }}</CardDescription>
                            <div :class="[stat.bg, 'rounded-lg p-2']">
                                <component :is="stat.icon" :class="[stat.color, 'h-4 w-4']" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold">{{ stat.value }}</div>
                        </CardContent>
                    </Card>
                </template>
            </div>

            <!-- Row 5: Activity & Notification Charts -->
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Activity Bar Chart -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <TrendingUp class="text-chart-1 h-4 w-4" />
                            <CardTitle class="text-base">Actividad Semanal</CardTitle>
                        </div>
                        <CardDescription>Registros de actividad de los últimos 7 días</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="flex items-end gap-2" style="height: 220px">
                                <Skeleton v-for="n in 7" :key="n" class="flex-1 rounded-t-md" :style="{ height: `${30 + Math.random() * 60}%` }" />
                            </div>
                        </template>
                        <BarChart v-else :data="liveActivityPerDay" :height="220" />
                    </CardContent>
                </Card>

                <!-- Notifications Area Chart -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2">
                            <Bell class="text-chart-2 h-4 w-4" />
                            <CardTitle class="text-base">Notificaciones Semanal</CardTitle>
                        </div>
                        <CardDescription>Notificaciones generadas en los últimos 7 días</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="flex items-end gap-2" style="height: 220px">
                                <Skeleton v-for="n in 7" :key="n" class="flex-1 rounded-t-md" :style="{ height: `${20 + Math.random() * 50}%` }" />
                            </div>
                        </template>
                        <AreaChart v-else :data="liveNotificationsPerDay" :height="220" color="var(--chart-2)" fill-color="var(--chart-2)" />
                    </CardContent>
                </Card>
            </div>

            <!-- Row 6: Notification Breakdown + Activity Type + Recent Activity -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Notification Breakdown Donut -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Estado de Notificaciones</CardTitle>
                        <CardDescription>Distribución de leídas vs no leídas</CardDescription>
                    </CardHeader>
                    <CardContent class="flex items-center justify-center">
                        <Skeleton v-if="loading" class="rounded-full" style="width: 180px; height: 180px" />
                        <DonutChart
                            v-else
                            :data="liveNotificationBreakdown"
                            :size="180"
                            :thickness="28"
                            :colors="['var(--chart-2)', 'var(--chart-3)']"
                        />
                    </CardContent>
                </Card>

                <!-- Activity by Event Donut -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Actividad por Tipo</CardTitle>
                        <CardDescription>Eventos registrados por tipo</CardDescription>
                    </CardHeader>
                    <CardContent class="flex items-center justify-center">
                        <Skeleton v-if="loading" class="rounded-full" style="width: 180px; height: 180px" />
                        <template v-else>
                            <DonutChart
                                v-if="liveActivityByEvent.length"
                                :data="liveActivityByEvent"
                                :size="180"
                                :thickness="28"
                            />
                            <p v-else class="text-muted-foreground text-sm">Sin datos de eventos</p>
                        </template>
                    </CardContent>
                </Card>

                <!-- Recent Activity -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Actividad Reciente</CardTitle>
                        <CardDescription>Últimos movimientos registrados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <template v-if="loading">
                            <div class="space-y-3">
                                <div v-for="n in 5" :key="n" class="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                    <Skeleton class="mt-0.5 h-7 w-7 rounded-full" />
                                    <div class="min-w-0 flex-1 space-y-2">
                                        <Skeleton class="h-4 w-3/4" />
                                        <div class="flex items-center gap-2">
                                            <Skeleton class="h-4 w-14 rounded" />
                                            <Skeleton class="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="liveRecentActivity.length" class="space-y-3">
                                <div
                                    v-for="item in liveRecentActivity"
                                    :key="item.id"
                                    class="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                                >
                                    <div class="bg-chart-1/10 mt-0.5 rounded-full p-1.5">
                                        <Activity class="text-chart-1 h-3 w-3" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-medium">{{ item.description }}</p>
                                        <div class="text-muted-foreground flex items-center gap-2 text-xs">
                                            <span class="bg-muted rounded px-1.5 py-0.5 font-mono">{{ item.event }}</span>
                                            <span>{{ item.created_at }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center py-8">
                                <TrendingDown class="text-muted-foreground mb-2 h-8 w-8" />
                                <p class="text-muted-foreground text-sm">Sin actividad reciente</p>
                            </div>
                        </template>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>

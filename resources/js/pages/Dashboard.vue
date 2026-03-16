<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Users, Bell, BellOff, Activity, TrendingUp, TrendingDown } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';

import { BarChart, AreaChart, DonutChart } from '@/components/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface ChartDataItem {
    label: string;
    value: number;
}

interface RecentActivityItem {
    id: number;
    description: string;
    event: string;
    created_at: string;
}

const props = defineProps<{
    stats: {
        totalUsers: number;
        totalNotifications: number;
        unreadNotifications: number;
        todayActivity: number;
    };
    activityPerDay: ChartDataItem[];
    notificationsPerDay: ChartDataItem[];
    notificationBreakdown: ChartDataItem[];
    activityByEvent: ChartDataItem[];
    recentActivity: RecentActivityItem[];
}>();

// Reactive copies of server data for real-time updates
const liveStats = ref({ ...props.stats });
const liveNotificationsPerDay = ref([...props.notificationsPerDay]);
const liveNotificationBreakdown = ref([...props.notificationBreakdown]);
const liveActivityPerDay = ref([...props.activityPerDay]);
const liveActivityByEvent = ref([...props.activityByEvent]);
const liveRecentActivity = ref([...props.recentActivity]);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Control',
        href: dashboard(),
    },
];

const statCards = computed(() => [
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

// Listen for real-time dashboard updates from Pusher
const handleDashboardUpdated = ((event: CustomEvent) => {
    const data = event.detail;
    if (data.stats) {
        liveStats.value = { ...data.stats };
    }
    if (data.notificationsPerDay) {
        liveNotificationsPerDay.value = [...data.notificationsPerDay];
    }
    if (data.notificationBreakdown) {
        liveNotificationBreakdown.value = [...data.notificationBreakdown];
    }
}) as EventListener;

onMounted(() => {
    window.addEventListener('dashboard-updated', handleDashboardUpdated);
});

onUnmounted(() => {
    window.removeEventListener('dashboard-updated', handleDashboardUpdated);
});
</script>

<template>
    <Head title="Panel de Control" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
            <!-- KPI Stat Cards -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card v-for="stat in statCards" :key="stat.title">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardDescription class="text-sm font-medium">{{ stat.title }}</CardDescription>
                        <div :class="[stat.bg, 'rounded-lg p-2']">
                            <component :is="stat.icon" :class="[stat.color, 'h-4 w-4']" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="text-3xl font-bold">{{ stat.value }}</div>
                    </CardContent>
                </Card>
            </div>

            <!-- Charts Row 1 -->
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
                        <BarChart :data="liveActivityPerDay" :height="220" />
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
                        <AreaChart :data="liveNotificationsPerDay" :height="220" color="var(--chart-2)" fill-color="var(--chart-2)" />
                    </CardContent>
                </Card>
            </div>

            <!-- Charts Row 2 -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Notification Breakdown Donut -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Estado de Notificaciones</CardTitle>
                        <CardDescription>Distribución de leídas vs no leídas</CardDescription>
                    </CardHeader>
                    <CardContent class="flex items-center justify-center">
                        <DonutChart
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
                        <DonutChart
                            v-if="liveActivityByEvent.length"
                            :data="liveActivityByEvent"
                            :size="180"
                            :thickness="28"
                        />
                        <p v-else class="text-muted-foreground text-sm">Sin datos de eventos</p>
                    </CardContent>
                </Card>

                <!-- Recent Activity -->
                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Actividad Reciente</CardTitle>
                        <CardDescription>Últimos movimientos registrados</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>

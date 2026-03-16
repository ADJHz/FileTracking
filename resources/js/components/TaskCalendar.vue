<script setup lang="ts">
import type { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { computed } from 'vue';

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
}>();

const priorityColors: Record<string, string> = {
    baja: '#3b82f6',
    media: '#f59e0b',
    alta: '#f97316',
    urgente: '#ef4444',
};

const calendarEvents = computed<EventInput[]>(() => {
    return props.tasks
        .filter(t => t.due_date)
        .map(t => {
            const startDate = t.created_at ? t.created_at.split('T')[0] : t.due_date!;
            // Add one day to due_date for FullCalendar exclusive end
            const endDate = new Date(t.due_date!);
            endDate.setDate(endDate.getDate() + 1);

            return {
                id: String(t.id),
                title: `${t.task_id} — ${t.title}`,
                start: startDate,
                end: endDate.toISOString().split('T')[0],
                backgroundColor: t.status?.color || priorityColors[t.priority] || '#6b7280',
                borderColor: t.status?.color || priorityColors[t.priority] || '#6b7280',
                textColor: '#ffffff',
                extendedProps: { task: t },
            };
        });
});

const calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
        left: 'prev,today,next',
        center: 'title',
        right: 'dayGridDay,dayGridMonth,multiMonthYear',
    },
    buttonText: {
        today: 'Hoy',
        day: 'Día',
        month: 'Mes',
        year: 'Año',
    },
    events: calendarEvents.value,
    height: 'auto',
    dayMaxEvents: 3,
    eventDisplay: 'block',
    firstDay: 1,
    eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
    },
}));
</script>

<template>
    <div class="task-calendar">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<style>
/* FullCalendar theme overrides for Tailwind dark/light mode */
.task-calendar .fc {
    --fc-border-color: hsl(var(--border));
    --fc-today-bg-color: hsl(var(--accent) / 0.3);
    --fc-neutral-bg-color: hsl(var(--muted));
    --fc-page-bg-color: transparent;
    --fc-event-border-color: transparent;
    font-family: inherit;
}

.task-calendar .fc .fc-toolbar-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground));
}

.task-calendar .fc .fc-button {
    background-color: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    color: hsl(var(--foreground));
    font-size: 0.8125rem;
    font-weight: 500;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    text-transform: capitalize;
    box-shadow: none;
}

.task-calendar .fc .fc-button:hover {
    background-color: hsl(var(--accent));
}

.task-calendar .fc .fc-button-active,
.task-calendar .fc .fc-button.fc-button-active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
}

.task-calendar .fc .fc-col-header-cell {
    background-color: hsl(var(--muted) / 0.5);
    padding: 0.5rem 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: hsl(var(--muted-foreground));
}

.task-calendar .fc .fc-daygrid-day-number {
    font-size: 0.8125rem;
    color: hsl(var(--foreground));
    padding: 0.25rem 0.5rem;
}

.task-calendar .fc .fc-event {
    font-size: 0.6875rem;
    border-radius: 0.25rem;
    padding: 1px 4px;
    cursor: default;
}

.task-calendar .fc .fc-daygrid-more-link {
    font-size: 0.6875rem;
    color: hsl(var(--primary));
    font-weight: 600;
}

.task-calendar .fc .fc-multimonth {
    border: none;
}

.task-calendar .fc th,
.task-calendar .fc td {
    border-color: hsl(var(--border));
}
</style>


<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $now = Carbon::now();

        // === TASK STATS ===
        $totalTasks = Task::count();
        $completedTasks = Task::whereHas('status', fn ($q) => $q->where('name', 'Completada'))->count();
        $inProgressTasks = Task::whereHas('status', fn ($q) => $q->where('name', 'En curso'))->count();
        $overdueTasks = Task::where('due_date', '<', $now->toDateString())
            ->whereHas('status', fn ($q) => $q->whereNotIn('name', ['Completada', 'Cancelada']))
            ->count();

        $tasksByStatus = TaskStatus::withCount('tasks')
            ->orderBy('order')
            ->get()
            ->map(fn ($s) => [
                'label' => $s->name,
                'value' => $s->tasks_count,
                'color' => $s->color,
            ])
            ->values();

        $tasksByPriority = Task::select('priority', DB::raw('COUNT(*) as total'))
            ->groupBy('priority')
            ->get()
            ->map(fn ($row) => [
                'label' => ucfirst($row->priority),
                'value' => $row->total,
            ])
            ->values();

        $tasksPerDay = collect(range(6, 0))->map(function ($daysAgo) use ($now) {
            $date = $now->copy()->subDays($daysAgo);
            return [
                'label' => $date->locale('es')->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'value' => Task::whereDate('created_at', $date->toDateString())->count(),
            ];
        })->values();

        $upcomingDeadlines = Task::with(['status', 'type', 'assignee'])
            ->whereBetween('due_date', [$now->toDateString(), $now->copy()->addDays(7)->toDateString()])
            ->whereHas('status', fn ($q) => $q->whereNotIn('name', ['Completada', 'Cancelada']))
            ->orderBy('due_date')
            ->limit(6)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'task_id' => $t->task_id,
                'title' => $t->title,
                'due_date' => $t->due_date->toDateString(),
                'due_label' => $t->due_date->isToday()
                    ? 'Hoy'
                    : ($t->due_date->isTomorrow() ? 'Mañana' : $t->due_date->locale('es')->isoFormat('D MMM')),
                'priority' => $t->priority,
                'status_name' => $t->status->name,
                'status_color' => $t->status->color,
                'assignee_name' => $t->assignee?->name,
            ]);

        // === EXISTING STATS ===
        $totalUsers = User::count();
        $totalNotifications = Notification::count();
        $unreadNotifications = Notification::whereNull('read_at')->count();
        $todayActivity = DB::table(config('activitylog.table_name', 'activity_log'))
            ->whereDate('created_at', $now->toDateString())
            ->count();

        $activityPerDay = collect(range(6, 0))->map(function ($daysAgo) use ($now) {
            $date = $now->copy()->subDays($daysAgo);
            $count = DB::table(config('activitylog.table_name', 'activity_log'))
                ->whereDate('created_at', $date->toDateString())
                ->count();

            return [
                'label' => $date->locale('es')->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'value' => $count,
            ];
        })->values();

        $notificationsPerDay = collect(range(6, 0))->map(function ($daysAgo) use ($now) {
            $date = $now->copy()->subDays($daysAgo);
            $count = Notification::whereDate('created_at', $date->toDateString())->count();

            return [
                'label' => $date->locale('es')->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'value' => $count,
            ];
        })->values();

        $readCount = Notification::whereNotNull('read_at')->count();
        $notificationBreakdown = [
            ['label' => 'Leídas', 'value' => $readCount],
            ['label' => 'No leídas', 'value' => $unreadNotifications],
        ];

        $activityByEvent = DB::table(config('activitylog.table_name', 'activity_log'))
            ->select('event', DB::raw('COUNT(*) as total'))
            ->whereNotNull('event')
            ->groupBy('event')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'label' => ucfirst($row->event),
                'value' => $row->total,
            ])
            ->values();

        $recentActivity = DB::table(config('activitylog.table_name', 'activity_log'))
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'description' => $row->description,
                'event' => $row->event ?? '-',
                'created_at' => Carbon::parse($row->created_at)->diffForHumans(),
            ]);

        $payload = [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalNotifications' => $totalNotifications,
                'unreadNotifications' => $unreadNotifications,
                'todayActivity' => $todayActivity,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'inProgressTasks' => $inProgressTasks,
                'overdueTasks' => $overdueTasks,
            ],
            'tasksByStatus' => $tasksByStatus,
            'tasksByPriority' => $tasksByPriority,
            'tasksPerDay' => $tasksPerDay,
            'upcomingDeadlines' => $upcomingDeadlines,
            'activityPerDay' => $activityPerDay,
            'notificationsPerDay' => $notificationsPerDay,
            'notificationBreakdown' => $notificationBreakdown,
            'activityByEvent' => $activityByEvent,
            'recentActivity' => $recentActivity,
            'synced_at' => now()->toISOString(),
        ];

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($payload);
        }

        return Inertia::render('Dashboard', $payload);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        // KPI stats
        $totalUsers = User::count();
        $totalNotifications = Notification::count();
        $unreadNotifications = Notification::whereNull('read_at')->count();
        $todayActivity = DB::table(config('activitylog.table_name', 'activity_log'))
            ->whereDate('created_at', $now->toDateString())
            ->count();

        // Activity per day (last 7 days)
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

        // Notifications per day (last 7 days)
        $notificationsPerDay = collect(range(6, 0))->map(function ($daysAgo) use ($now) {
            $date = $now->copy()->subDays($daysAgo);
            $count = Notification::whereDate('created_at', $date->toDateString())->count();

            return [
                'label' => $date->locale('es')->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'value' => $count,
            ];
        })->values();

        // Notification status breakdown
        $readCount = Notification::whereNotNull('read_at')->count();
        $notificationBreakdown = [
            ['label' => 'Leídas', 'value' => $readCount],
            ['label' => 'No leídas', 'value' => $unreadNotifications],
        ];

        // Activity by event type
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

        // Recent activity
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

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalNotifications' => $totalNotifications,
                'unreadNotifications' => $unreadNotifications,
                'todayActivity' => $todayActivity,
            ],
            'activityPerDay' => $activityPerDay,
            'notificationsPerDay' => $notificationsPerDay,
            'notificationBreakdown' => $notificationBreakdown,
            'activityByEvent' => $activityByEvent,
            'recentActivity' => $recentActivity,
        ]);
    }
}

<?php

namespace App\Helpers;

use App\Events\DashboardUpdated;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardBroadcaster
{
    public static function broadcast(): void
    {
        $now = Carbon::now();

        $totalNotifications = Notification::count();
        $unreadNotifications = Notification::whereNull('read_at')->count();
        $readCount = Notification::whereNotNull('read_at')->count();

        $stats = [
            'totalUsers' => User::count(),
            'totalNotifications' => $totalNotifications,
            'unreadNotifications' => $unreadNotifications,
            'todayActivity' => DB::table(config('activitylog.table_name', 'activity_log'))
                ->whereDate('created_at', $now->toDateString())
                ->count(),
        ];

        $notificationsPerDay = collect(range(6, 0))->map(function ($daysAgo) use ($now) {
            $date = $now->copy()->subDays($daysAgo);

            return [
                'label' => $date->locale('es')->isoFormat('ddd'),
                'date' => $date->toDateString(),
                'value' => Notification::whereDate('created_at', $date->toDateString())->count(),
            ];
        })->values()->toArray();

        $notificationBreakdown = [
            ['label' => 'Leídas', 'value' => $readCount],
            ['label' => 'No leídas', 'value' => $unreadNotifications],
        ];

        broadcast(new DashboardUpdated($stats, $notificationsPerDay, $notificationBreakdown));
    }
}

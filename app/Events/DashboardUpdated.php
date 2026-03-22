<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DashboardUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $stats;
    public array $notificationsPerDay;
    public array $notificationBreakdown;

    public function __construct(array $stats, array $notificationsPerDay, array $notificationBreakdown)
    {
        $this->stats = $stats;
        $this->notificationsPerDay = $notificationsPerDay;
        $this->notificationBreakdown = $notificationBreakdown;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('filetracking'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DashboardUpdated';
    }
}

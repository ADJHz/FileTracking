<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $action;
    public ?string $notificationId;
    public int $userId;
    public int $unreadCount;

    public function __construct(string $action, int $userId, int $unreadCount, ?string $notificationId = null)
    {
        $this->action = $action;
        $this->userId = $userId;
        $this->unreadCount = $unreadCount;
        $this->notificationId = $notificationId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifications.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'NotificationStatusChanged';
    }
}

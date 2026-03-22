<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Notification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $user_id;
    public $data;
    public $notification_id;
    public $created_at;

    /**
     * Create a new event instance.
     */
    public function __construct($message, $user_id = null, $data = [], $notification_id = null, $created_at = null)
    {
        $this->message = $message;
        $this->user_id = $user_id;
        $this->data = $data;
        $this->notification_id = $notification_id;
        $this->created_at = $created_at;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if ($this->user_id) {
            return [
                new PrivateChannel('notifications.' . $this->user_id),
            ];
        }

        return [
            new PrivateChannel('filetracking'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'Notification';
    }
}

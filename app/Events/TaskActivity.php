<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskActivity implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $action;
    public array $task;
    public ?string $changedField;
    public ?string $oldValue;
    public ?string $newValue;
    public string $userName;
    public string $timestamp;

    public function __construct(
        string $action,
        Task $task,
        string $userName,
        ?string $changedField = null,
        ?string $oldValue = null,
        ?string $newValue = null,
    ) {
        $this->action = $action;
        $this->task = $task->load(['status', 'type', 'area', 'assignee', 'creator'])->toArray();
        $this->userName = $userName;
        $this->changedField = $changedField;
        $this->oldValue = $oldValue;
        $this->newValue = $newValue;
        $this->timestamp = now()->toISOString();
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('filetracking'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.activity';
    }
}

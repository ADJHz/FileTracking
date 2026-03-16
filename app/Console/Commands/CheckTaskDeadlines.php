<?php

namespace App\Console\Commands;

use App\Events\TaskActivity;
use App\Models\Notification;
use App\Models\Task;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CheckTaskDeadlines extends Command
{
    protected $signature = 'tasks:check-deadlines';
    protected $description = 'Check for tasks due within 1 day and send notifications';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        $tasks = Task::with(['status', 'type', 'area', 'assignee', 'creator'])
            ->whereDate('due_date', $tomorrow)
            ->whereNotIn('status_id', function ($query) {
                $query->select('id')
                    ->from('task_statuses')
                    ->whereIn('name', ['Completada', 'Cancelada']);
            })
            ->get();

        if ($tasks->isEmpty()) {
            $this->info('No tasks due tomorrow.');
            return self::SUCCESS;
        }

        $users = User::all();

        foreach ($tasks as $task) {
            // Broadcast real-time toast
            try {
                broadcast(new TaskActivity('deadline_warning', $task, 'Sistema'));
            } catch (\Throwable $e) {
                $this->error("Broadcast failed for task {$task->task_id}: {$e->getMessage()}");
            }

            // Create notification for all users
            foreach ($users as $user) {
                try {
                    Notification::create([
                        'id' => (string) Str::uuid(),
                        'type' => 'App\\Notifications\\TaskDeadlineWarning',
                        'user_id' => $user->id,
                        'data' => [
                            'title' => '⏰ Fecha límite próxima',
                            'message' => "La tarea {$task->task_id}: {$task->title} vence mañana",
                            'type' => 'error',
                            'task_id' => $task->task_id,
                            'task_db_id' => $task->id,
                        ],
                        'read_at' => null,
                    ]);
                } catch (\Throwable $e) {
                    $this->error("Notification creation failed: {$e->getMessage()}");
                }
            }

            $this->info("Deadline warning sent for task {$task->task_id}: {$task->title}");
        }

        $this->info("Processed {$tasks->count()} task(s) with upcoming deadlines.");
        return self::SUCCESS;
    }
}

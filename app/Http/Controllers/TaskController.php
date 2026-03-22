<?php

namespace App\Http\Controllers;

use App\Events\TaskActivity;
use App\Models\Area;
use App\Models\Notification;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\TaskType;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::with(['status', 'type', 'area', 'assignee', 'creator'])
            ->orderByDesc('created_at')
            ->get();

        $statuses = TaskStatus::orderBy('order')->get();
        $types = TaskType::orderBy('order')->get();
        $areas = Area::orderBy('order')->get();
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(compact('tasks', 'statuses', 'types', 'areas', 'users'));
        }

        return Inertia::render('Tasks/Index', compact('tasks', 'statuses', 'types', 'areas', 'users'));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'status_id' => 'required|exists:task_statuses,id',
            'type_id' => 'required|exists:task_types,id',
            'area_id' => 'nullable|exists:areas,id',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => ['required', Rule::in(['baja', 'media', 'alta', 'urgente'])],
            'due_date' => 'nullable|date',
        ]);

        // Sanitize text inputs
        $validated['title'] = strip_tags($validated['title']);
        if (!empty($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        $validated['created_by'] = Auth::id();

        $task = $this->createTaskWithUniqueId($validated);
        $task->load(['status', 'type', 'area', 'assignee', 'creator']);

        $user = Auth::user();
        $this->broadcastTaskActivity('created', $task, $user->name);
        $this->createTaskNotification(
            'Nueva tarea creada',
            "{$user->name} creó la tarea {$task->task_id}: {$task->title}",
            'info',
            $task
        );

        return response()->json(['success' => true, 'task' => $task], 201);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'status_id' => 'sometimes|required|exists:task_statuses,id',
            'type_id' => 'sometimes|required|exists:task_types,id',
            'area_id' => 'sometimes|nullable|exists:areas,id',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => ['sometimes', 'required', Rule::in(['baja', 'media', 'alta', 'urgente'])],
            'due_date' => 'nullable|date',
        ]);

        // Sanitize text inputs
        if (isset($validated['title'])) {
            $validated['title'] = strip_tags($validated['title']);
        }
        if (!empty($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        $user = Auth::user();
        $oldStatus = $task->status ? $task->status->name : null;
        $oldPriority = $task->priority;

        $task->update($validated);
        $task->load(['status', 'type', 'area', 'assignee', 'creator']);

        // Detect status change
        if (isset($validated['status_id']) && $oldStatus !== $task->status->name) {
            $this->broadcastTaskActivity('status_changed', $task, $user->name, 'estado', $oldStatus, $task->status->name);
            $this->createTaskNotification(
                'Estado de tarea actualizado',
                "{$user->name} cambió el estado de {$task->task_id} de \"{$oldStatus}\" a \"{$task->status->name}\"",
                'warning',
                $task
            );
        }

        // Detect priority change
        if (isset($validated['priority']) && $oldPriority !== $task->priority) {
            $priorityLabels = ['baja' => 'Baja', 'media' => 'Media', 'alta' => 'Alta', 'urgente' => 'Urgente'];
            $this->broadcastTaskActivity('priority_changed', $task, $user->name, 'prioridad', $priorityLabels[$oldPriority] ?? $oldPriority, $priorityLabels[$task->priority] ?? $task->priority);
            $this->createTaskNotification(
                'Prioridad de tarea actualizada',
                "{$user->name} cambió la prioridad de {$task->task_id} de \"{$priorityLabels[$oldPriority]}\" a \"{$priorityLabels[$task->priority]}\"",
                $task->priority === 'urgente' ? 'error' : 'warning',
                $task
            );
        }

        // Generic update if no specific field changed
        if (!isset($validated['status_id']) || $oldStatus === $task->status->name) {
            if (!isset($validated['priority']) || $oldPriority === $task->priority) {
                $this->broadcastTaskActivity('updated', $task, $user->name);
            }
        }

        return response()->json(['success' => true, 'task' => $task]);
    }

    public function destroy(Task $task): JsonResponse
    {
        $user = Auth::user();

        $this->broadcastTaskActivity('deleted', $task, $user->name);

        $task->delete();

        return response()->json(['success' => true]);
    }

    private function createTaskWithUniqueId(array $validated): Task
    {
        $maxAttempts = 5;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                return DB::transaction(function () use ($validated) {
                    $validated['task_id'] = $this->generateTaskId();

                    return Task::create($validated);
                });
            } catch (QueryException $e) {
                if (! $this->isTaskIdCollision($e) || $attempt === $maxAttempts) {
                    throw $e;
                }
            }
        }

        throw new \RuntimeException('Unable to create a task with a unique task_id.');
    }

    private function generateTaskId(): string
    {
        $lastTaskId = Task::withTrashed()
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('task_id');

        if (! $lastTaskId) {
            return 'TMYT-001';
        }

        preg_match('/(\d+)$/', $lastTaskId, $matches);
        $nextNum = isset($matches[1]) ? ((int) $matches[1]) + 1 : 1;

        return 'TMYT-' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
    }

    private function isTaskIdCollision(QueryException $e): bool
    {
        $sqlState = (string) ($e->errorInfo[0] ?? '');
        $isUniqueViolation = in_array($sqlState, ['23000', '23505'], true);

        return $isUniqueViolation && str_contains(strtolower($e->getMessage()), 'task_id');
    }

    private function broadcastTaskActivity(string $action, Task $task, string $userName, ?string $field = null, ?string $old = null, ?string $new = null): void
    {
        try {
            broadcast(new TaskActivity($action, $task, $userName, $field, $old, $new));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Failed to broadcast task activity: ' . $e->getMessage());
        }
    }

    private function createTaskNotification(string $title, string $message, string $type, Task $task): void
    {
        try {
            $users = User::all();
            foreach ($users as $user) {
                Notification::create([
                    'id' => (string) Str::uuid(),
                    'type' => 'App\\Notifications\\TaskNotification',
                    'user_id' => $user->id,
                    'data' => [
                        'title' => $title,
                        'message' => $message,
                        'type' => $type,
                        'task_id' => $task->task_id,
                        'task_db_id' => $task->id,
                    ],
                    'read_at' => null,
                ]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Failed to create task notification: ' . $e->getMessage());
        }
    }
}

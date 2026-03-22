<?php

namespace Tests\Feature\Api;

use App\Models\Notification;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\TaskType;
use App\Models\User;
use Database\Seeders\TaskCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiV1EndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TaskCatalogSeeder::class);
    }

    public function test_unauthenticated_requests_are_rejected_for_v1_api(): void
    {
        $this->getJson('/api/v1/tasks')->assertUnauthorized();
        $this->getJson('/api/v1/notifications')->assertUnauthorized();
        $this->getJson('/api/v1/dashboard')->assertUnauthorized();
    }

    public function test_dashboard_endpoint_returns_json_payload(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'stats' => [
                    'totalUsers',
                    'totalNotifications',
                    'unreadNotifications',
                    'todayActivity',
                    'totalTasks',
                    'completedTasks',
                    'inProgressTasks',
                    'overdueTasks',
                ],
                'tasksByStatus',
                'tasksByPriority',
                'tasksPerDay',
                'upcomingDeadlines',
                'activityPerDay',
                'notificationsPerDay',
                'notificationBreakdown',
                'activityByEvent',
                'recentActivity',
                'synced_at',
            ]);
    }

    public function test_tasks_endpoint_returns_json_payload(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        Sanctum::actingAs($user);

        $status = TaskStatus::query()->firstOrFail();
        $type = TaskType::query()->firstOrFail();

        Task::create([
            'task_id' => 'TMYT-001',
            'title' => 'Tarea API',
            'description' => null,
            'status_id' => $status->id,
            'type_id' => $type->id,
            'area_id' => null,
            'assigned_to' => null,
            'created_by' => $user->id,
            'priority' => 'media',
            'due_date' => null,
        ]);

        $response = $this->getJson('/api/v1/tasks');

        $response->assertOk()
            ->assertJsonStructure([
                'tasks',
                'statuses',
                'types',
                'areas',
                'users',
            ]);
    }

    public function test_notifications_endpoint_returns_json_payload(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        Sanctum::actingAs($user);

        Notification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\TestNotification',
            'user_id' => $user->id,
            'data' => [
                'title' => 'Demo',
                'message' => 'Mensaje demo',
                'type' => 'info',
            ],
            'read_at' => null,
        ]);

        $response = $this->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonStructure([
                'notifications' => ['data'],
                'unread_count',
            ])
            ->assertJsonPath('unread_count', 1);
    }

    public function test_task_write_endpoints_create_update_and_delete_records(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        Sanctum::actingAs($user);

        $status = TaskStatus::query()->firstOrFail();
        $type = TaskType::query()->firstOrFail();

        $storePayload = [
            'title' => 'Tarea segura API',
            'description' => 'Contenido',
            'status_id' => $status->id,
            'type_id' => $type->id,
            'priority' => 'media',
            'due_date' => now()->addDay()->toDateString(),
        ];

        $store = $this->postJson('/api/v1/tasks', $storePayload);

        $store->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('task.title', 'Tarea segura API');

        $taskId = (int) $store->json('task.id');

        $update = $this->putJson("/api/v1/tasks/{$taskId}", [
            'title' => 'Tarea actualizada',
            'priority' => 'alta',
        ]);

        $update->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('task.title', 'Tarea actualizada')
            ->assertJsonPath('task.priority', 'alta');

        $delete = $this->deleteJson("/api/v1/tasks/{$taskId}");

        $delete->assertOk()->assertJsonPath('success', true);
    }

    public function test_notification_mutations_reject_access_for_other_users_notifications(): void
    {
        $owner = User::factory()->create(['email_verified_at' => now()]);
        $attacker = User::factory()->create(['email_verified_at' => now()]);

        $notification = Notification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\TestNotification',
            'user_id' => $owner->id,
            'data' => ['title' => 'Privada', 'message' => 'Solo owner', 'type' => 'info'],
            'read_at' => null,
        ]);

        Sanctum::actingAs($attacker);

        $this->patchJson("/api/v1/notifications/{$notification->id}/read")
            ->assertForbidden();

        $this->deleteJson("/api/v1/notifications/{$notification->id}")
            ->assertForbidden();
    }
}

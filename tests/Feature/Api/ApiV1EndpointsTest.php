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
use Tests\TestCase;

class ApiV1EndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TaskCatalogSeeder::class);
    }

    public function test_dashboard_endpoint_returns_json_payload(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/dashboard');

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

        $response = $this->actingAs($user)
            ->getJson('/api/v1/tasks');

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

        $response = $this->actingAs($user)
            ->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonStructure([
                'notifications' => ['data'],
                'unread_count',
            ])
            ->assertJsonPath('unread_count', 1);
    }
}

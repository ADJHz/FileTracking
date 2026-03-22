<?php

namespace Tests\Feature\Tasks;

use App\Models\Area;
use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\TaskType;
use App\Models\User;
use Database\Seeders\TaskCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TaskCatalogSeeder::class);
    }

    public function test_it_creates_a_task_with_optional_area_as_null(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $status = TaskStatus::query()->firstOrFail();
        $type = TaskType::query()->firstOrFail();

        $payload = [
            'title' => 'Nueva tarea sin area',
            'description' => 'Descripcion de prueba',
            'status_id' => $status->id,
            'type_id' => $type->id,
            'area_id' => null,
            'assigned_to' => null,
            'priority' => 'media',
            'due_date' => now()->addDays(2)->toDateString(),
        ];

        $response = $this->actingAs($user)->postJson(route('tasks.store'), $payload);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('task.area_id', null);

        $this->assertDatabaseCount('tasks', 1);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Nueva tarea sin area',
            'area_id' => null,
            'created_by' => $user->id,
        ]);

        $task = Task::query()->firstOrFail();
        $this->assertMatchesRegularExpression('/^TMYT-\d{3,}$/', $task->task_id);
    }

    public function test_it_creates_a_task_with_explicit_area(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $status = TaskStatus::query()->firstOrFail();
        $type = TaskType::query()->firstOrFail();
        $area = Area::query()->firstOrFail();

        $payload = [
            'title' => 'Nueva tarea con area',
            'description' => null,
            'status_id' => $status->id,
            'type_id' => $type->id,
            'area_id' => $area->id,
            'assigned_to' => null,
            'priority' => 'alta',
            'due_date' => null,
        ];

        $response = $this->actingAs($user)->postJson(route('tasks.store'), $payload);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('task.area_id', $area->id);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Nueva tarea con area',
            'area_id' => $area->id,
            'created_by' => $user->id,
        ]);
    }
}

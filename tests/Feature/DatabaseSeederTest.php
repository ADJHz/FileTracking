<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_task_catalogs_and_base_user(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        $this->assertDatabaseCount('task_statuses', 6);
        $this->assertDatabaseCount('task_types', 6);
        $this->assertDatabaseCount('areas', 8);

        $this->assertDatabaseHas('task_statuses', ['name' => 'Pendiente']);
        $this->assertDatabaseHas('task_types', ['name' => 'Documento']);
        $this->assertDatabaseHas('areas', ['name' => 'Archivo General']);
    }
}

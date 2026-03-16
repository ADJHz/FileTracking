<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\TaskStatus;
use App\Models\TaskType;
use Illuminate\Database\Seeder;

class TaskCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'Pendiente', 'color' => '#6b7280', 'order' => 1],
            ['name' => 'Listo para empezar', 'color' => '#f59e0b', 'order' => 2],
            ['name' => 'En curso', 'color' => '#10b981', 'order' => 3],
            ['name' => 'En revisión', 'color' => '#8b5cf6', 'order' => 4],
            ['name' => 'Completada', 'color' => '#3b82f6', 'order' => 5],
            ['name' => 'Cancelada', 'color' => '#ef4444', 'order' => 6],
        ];

        foreach ($statuses as $status) {
            TaskStatus::firstOrCreate(['name' => $status['name']], $status);
        }

        $types = [
            ['name' => 'Documento', 'color' => '#f97316', 'order' => 1],
            ['name' => 'Expediente', 'color' => '#3b82f6', 'order' => 2],
            ['name' => 'Proyecto', 'color' => '#10b981', 'order' => 3],
            ['name' => 'Factura', 'color' => '#ec4899', 'order' => 4],
            ['name' => 'Calidad', 'color' => '#8b5cf6', 'order' => 5],
            ['name' => 'Función', 'color' => '#06b6d4', 'order' => 6],
        ];

        foreach ($types as $type) {
            TaskType::firstOrCreate(['name' => $type['name']], $type);
        }

        $areas = [
            ['name' => 'Archivo General', 'color' => '#8b5cf6', 'icon' => 'archive', 'order' => 1],
            ['name' => 'Recursos Humanos', 'color' => '#3b82f6', 'icon' => 'users', 'order' => 2],
            ['name' => 'Contabilidad y Finanzas', 'color' => '#10b981', 'icon' => 'calculator', 'order' => 3],
            ['name' => 'Jurídico', 'color' => '#ef4444', 'icon' => 'scale', 'order' => 4],
            ['name' => 'Dirección General', 'color' => '#f59e0b', 'icon' => 'building', 'order' => 5],
            ['name' => 'Sistemas e Informática', 'color' => '#06b6d4', 'icon' => 'monitor', 'order' => 6],
            ['name' => 'Atención Ciudadana', 'color' => '#ec4899', 'icon' => 'headphones', 'order' => 7],
            ['name' => 'Obras Públicas', 'color' => '#f97316', 'icon' => 'hard-hat', 'order' => 8],
        ];

        foreach ($areas as $area) {
            Area::firstOrCreate(['name' => $area['name']], $area);
        }
    }
}

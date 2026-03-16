<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    protected $fillable = ['name', 'color', 'order'];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'type_id');
    }
}

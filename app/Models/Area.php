<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    protected $fillable = [
        'name',
        'color',
        'icon',
        'order',
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}

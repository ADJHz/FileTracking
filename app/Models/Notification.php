<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Log;

class Notification extends DatabaseNotification
{
    protected $fillable = [
        'id',
        'type',
        'user_id',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(function (self $notification) {
            try {
                $data = is_array($notification->data) ? $notification->data : json_decode($notification->data, true);
                $userId = $notification->user_id ?? $notification->notifiable_id;
                broadcast(new \App\Events\Notification(
                    $data['message'] ?? 'Nueva notificación',
                    $userId,
                    $data,
                    $notification->id,
                    $notification->created_at?->toISOString() ?? now()->toISOString()
                ));
                Log::info('Notification broadcasted to FileTracking channel', ['user_id' => $userId]);
            } catch (\Throwable $e) {
                Log::error('Failed to broadcast notification: ' . $e->getMessage());
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }
}

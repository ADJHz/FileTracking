<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::middleware(['guest'])->group(function () {
    Route::inertia('/', 'auth/Login')->name('home');
});

// Test routes — auth protected
Route::middleware(['auth'])->group(function () {
    Route::get('/broadcast-test', function () {
        event(new \App\Events\SocketTest('Hello from server'));
        return 'broadcasted';
    });

    Route::get('/test-notification', function () {
        $user = auth()->user();
        $user->notify(new \App\Notifications\TestNotification(
            'Notificación de Prueba',
            'Esta es una notificación de prueba creada desde el navegador.',
            'info'
        ));
        return 'Notificación enviada a ' . $user->name;
    });

    Route::get('/test-realtime', function () {
        $user = auth()->user();
        $notification = \App\Models\Notification::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'type' => 'App\Notifications\TestNotification',
            'user_id' => $user->id,
            'data' => [
                'title' => '⚡ Notificación en Tiempo Real',
                'message' => 'Esta notificación se envió instantáneamente a través de WebSocket!',
                'type' => 'success',
            ],
            'read_at' => null,
        ]);
        broadcast(new \App\Events\NotificationSent($notification));
        return 'Notificación en tiempo real enviada a ' . $user->name;
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Notification routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [\App\Http\Controllers\NotificationController::class, 'index'])->name('index');
        Route::patch('/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('mark-as-read');
        Route::patch('/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::delete('/{notification}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('destroy');
    });

    // Task routes — rate limited
    Route::prefix('tasks')->name('tasks.')->middleware('throttle:60,1')->group(function () {
        Route::get('/', [\App\Http\Controllers\TaskController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\TaskController::class, 'store'])->name('store');
        Route::put('/{task}', [\App\Http\Controllers\TaskController::class, 'update'])->name('update');
        Route::delete('/{task}', [\App\Http\Controllers\TaskController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';

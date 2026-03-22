<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'verified', 'throttle:api-v1'])->prefix('v1')->name('api.v1.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::get('/', [TaskController::class, 'index'])->name('index');
        Route::post('/', [TaskController::class, 'store'])->middleware('throttle:api-write')->name('store');
        Route::put('/{task}', [TaskController::class, 'update'])->middleware('throttle:api-write')->name('update');
        Route::delete('/{task}', [TaskController::class, 'destroy'])->middleware('throttle:api-write')->name('destroy');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead'])->middleware('throttle:api-write')->name('mark-as-read');
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->middleware('throttle:api-write')->name('mark-all-read');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->middleware('throttle:api-write')->name('destroy');
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

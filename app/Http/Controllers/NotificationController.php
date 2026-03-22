<?php

namespace App\Http\Controllers;

use App\Events\NotificationStatusChanged;
use App\Helpers\DashboardBroadcaster;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(100);

        // Return Inertia page for browser visits, JSON for axios/API calls
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $user->unreadNotifications()->count(),
            ]);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if (($notification->notifiable_id ?? $notification->user_id) !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        $unreadCount = Auth::user()->unreadNotifications()->count();

        broadcast(new NotificationStatusChanged(
            'read',
            Auth::id(),
            $unreadCount,
            $notification->id,
        ));

        DashboardBroadcaster::broadcast();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);

        broadcast(new NotificationStatusChanged(
            'all-read',
            Auth::id(),
            0,
        ));

        DashboardBroadcaster::broadcast();

        return response()->json([
            'success' => true,
            'unread_count' => 0,
        ]);
    }

    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        // Ensure the notification belongs to the authenticated user
        if (($notification->notifiable_id ?? $notification->user_id) !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notificationId = $notification->id;
        $notification->delete();

        $unreadCount = Auth::user()->unreadNotifications()->count();

        broadcast(new NotificationStatusChanged(
            'deleted',
            Auth::id(),
            $unreadCount,
            $notificationId,
        ));

        DashboardBroadcaster::broadcast();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
        ]);
    }
}

<?php

namespace App\Console\Commands;

use App\Events\NotificationSent;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Broadcasting\PrivateChannel;

class SendTestNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification:test {user?} {--message= : Custom message}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test notification to a user or all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user');
        $customMessage = $this->option('message') ?: 'Esta es una notificación de prueba del sistema de seguimiento de archivos.';

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }

            $this->sendNotificationToUser($user, $customMessage);
            $this->info("Test notification sent to user: {$user->name}");
        } else {
            $users = User::all();
            foreach ($users as $user) {
                $this->sendNotificationToUser($user, $customMessage);
            }
            $this->info("Test notification sent to all users ({$users->count()} users)");
        }

        return 0;
    }

    private function sendNotificationToUser(User $user, string $message)
    {
        // Create notification in database
        $notification = Notification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\Notifications\TestNotification',
            'user_id' => $user->id,
            'data' => json_encode([
                'title' => 'Notificación de Prueba',
                'message' => $message,
                'type' => 'info',
            ]),
            'read_at' => null,
        ]);

        // Broadcast the notification to the user's private channel
        broadcast(new NotificationSent($notification));
        
        $this->line("  ✅ Notificación creada y broadcast disparado para usuario {$user->id}");
    }
}
}

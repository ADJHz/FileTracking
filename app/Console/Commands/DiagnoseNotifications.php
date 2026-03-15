<?php

namespace App\Console\Commands;

use App\Models\Notification;
use Illuminate\Console\Command;

class DiagnoseNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:diagnose';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Diagnose notifications data integrity';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $notifications = Notification::all();

        $this->info("Total notifications: {$notifications->count()}");

        foreach ($notifications as $notification) {
            $this->line("ID: {$notification->id}");
            $this->line("  Type: {$notification->type}");
            $this->line("  Data: " . json_encode($notification->data));

            if (!$notification->data) {
                $this->error("  ❌ Data is null/empty!");
            } elseif (!isset($notification->data['title'])) {
                $this->warn("  ⚠️  Missing 'title' in data");
            } elseif (!isset($notification->data['message'])) {
                $this->warn("  ⚠️  Missing 'message' in data");
            } else {
                $this->info("  ✅ Data looks good");
            }

            $this->line("  Read at: " . ($notification->read_at ?? 'Not read'));
            $this->line("");
        }

        return 0;
    }
}

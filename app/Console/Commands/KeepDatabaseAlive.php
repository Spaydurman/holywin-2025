<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class KeepDatabaseAlive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:keep-alive';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ping the database to prevent it from sleeping on Railway Hobby';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            DB::select('SELECT 1');
            $this->info('Database pinged successfully at ' . now());
        } catch (\Exception $e) {
            $this->error('Database ping failed: ' . $e->getMessage());
        }
    }
}

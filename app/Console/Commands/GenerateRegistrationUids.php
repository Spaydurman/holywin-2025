<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateRegistrationUids extends Command
{
    protected $signature = 'app:generate-registration-uids';

    protected $description = 'Generate UIDs for all registrations that don\'t have one';

    public function handle()
    {
        $registrations = \App\Models\Registration::whereNull('uid')->get();
        
        $bar = $this->output->createProgressBar(count($registrations));
        $bar->start();

        foreach ($registrations as $registration) {
            $uid = $this->generateUniqueUid();
            
            while (\App\Models\Registration::where('uid', $uid)->exists()) {
                $uid = $this->generateUniqueUid();
            }
            
            $registration->update(['uid' => $uid]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Successfully generated UIDs for ' . count($registrations) . ' registrations.');
        
        $emptyUidRegistrations = \App\Models\Registration::where('uid', '')->get();
        if ($emptyUidRegistrations->count() > 0) {
            $this->info('Updating ' . count($emptyUidRegistrations) . ' registrations with empty UIDs...');
            foreach ($emptyUidRegistrations as $registration) {
                $uid = $this->generateUniqueUid();
                while (\App\Models\Registration::where('uid', $uid)->exists()) {
                    $uid = $this->generateUniqueUid();
                }
                $registration->update(['uid' => $uid]);
            }
            $this->info('Successfully updated registrations with empty UIDs.');
        }
    }
    
    private function generateUniqueUid()
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $uid = 'LVLUP';
        
        for ($i = 0; $i < 4; $i++) {
            $uid .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        return $uid;
    }
}

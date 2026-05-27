<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AccrueMonthlyLeaveCommand extends Command
{
    // The terminal command name used to run this manually
    protected $signature = 'leave:accrue-monthly';

    // The description of what this command does
    protected $description = 'Accrues monthly paid leave (1.5 days) and adds Moroccan Labor Code seniority bonuses.';

    public function handle()
    {
        $this->info('Starting monthly leave accrual processing...');

        // 1. Fetch all users who have a valid hiring date configuration
        $users = DB::table('users')->whereNotNull('hired_at')->get();

        foreach ($users as $user) {
            $hiredAt = Carbon::parse($user->hired_at);
            $now = Carbon::now();

            // Calculate precise continuous months and years of service
            $monthsOfService = $hiredAt->diffInMonths($now);
            $yearsOfService = $hiredAt->diffInYears($now);

            //  Law Gatekeeper Rule: Less than 6 months = No accrual accumulation yet
            if ($monthsOfService < 6) {
                continue; 
            }
            //  Base monthly accrual allocation rate according to code
            $daysToAccrue = 1.5;

            //  Seniority Bonus Logic: 
            // Check if their hiring anniversary month is right NOW to grant extra days safely once a year
            if ($hiredAt->month === $now->month) {
                // Completed exactly 5 years up to 9 years -> grant +1.5 extra days
                if ($yearsOfService >= 5 && $yearsOfService < 10) {
                    $daysToAccrue += 1.5;
                    $this->info("User ID {$user->id} earned 1.5 days seniority bonus (5+ years).");
                } 
                // Completed 10 or more years -> grant +3.0 total extra days (+1.5 for each 5-year cycle)
                elseif ($yearsOfService >= 10) {
                    $daysToAccrue += 3.0;
                    $this->info("User ID {$user->id} earned 3.0 days seniority bonus (10+ years).");
                }
            }

            //  Update their balance row using raw Query Builder execution
            DB::table('leave_balances')
                ->where('user_id', $user->id)
                // Assuming type 1 represents your primary "Paid Annual Leave" category link
                ->where('leave_type_id', 1) 
                ->increment('remaining_days', $daysToAccrue);
        }

        $this->info('Leave accrual process completed successfully!');
    }
}
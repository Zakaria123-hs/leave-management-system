<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveSystemSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Sample Leave Types
        $types = [
            [
                'name' => 'Annual Leave',
                'is_balance_based' => true,
                'default_days' => 18,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sick Leave',
                'is_balance_based' => false,
                'default_days' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maternity/Paternity',
                'is_balance_based' => true,
                'default_days' => 90,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('leave_types')->insert($types);

        // 2. Assign Balances for User ID 1 (Assuming User 1 exists)
        // We only add balances for types where 'is_balance_based' is true
        $annualLeaveId = DB::table('leave_types')->where('name', 'Annual Leave')->value('id');
        
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type_id' => $annualLeaveId,
            'remaining_days' => 18, // Matches the default_days
            'used_days' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

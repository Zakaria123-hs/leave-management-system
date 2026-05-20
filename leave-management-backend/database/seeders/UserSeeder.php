<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

        // Create an HR Manager first
    public function run(): void
    {
        DB::table('users')->insert([
            // HR
            // Manager
            [
            'name'         => 'Ahmed supervisor',
            'email'        => 'ahmed@supervisor.com',
            'password'     => Hash::make('password'),
            'role'         => 'supervisor',
            'id_service'   => 2, // IT
            'supervisor_id'=> 2,
            'created_at'   => now(),
            'updated_at'   => now(),
            ],
            [
            'name'         => 'kenza supervisor',
            'email'        => 'kenza@supervisor.com',
            'password'     => Hash::make('password'),
            'role'         => 'supervisor',
            'id_service'   => 2, // IT
            'supervisor_id'=> 2,
            'created_at'   => now(),
            'updated_at'   => now(),
            ],
            [
                'name'         => 'Sara employee',
                'email'        => 'sara@hemployee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 1, // Human Resources
                'supervisor_id'=> 4,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            // Employees
            [
                'name'         => 'Youssef Employee',
                'email'        => 'youssef@employee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 2, // IT
                'supervisor_id'=> 4, // Ahmed is his manager
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Karim Employee',
                'email'        => 'karim@employee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 2, // IT
                'supervisor_id'=> 4, // Ahmed is his manager
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'otman employee',
                'email'        => 'otman@hemployee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 1, // Human Resources
                'supervisor_id'=> 5,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            // Employees
            [
                'name'         => 'hatim Employee',
                'email'        => 'hatim@employee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 2, // IT
                'supervisor_id'=> 5, // Ahmed is his manager
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'yassmin Employee',
                'email'        => 'yassmin@employee.com',
                'password'     => Hash::make('password'),
                'role'         => 'employee',
                'id_service'   => 2, // IT
                'supervisor_id'=> 5, // Ahmed is his manager
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}


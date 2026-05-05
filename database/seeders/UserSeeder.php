<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an HR Manager first
        $hr = \App\Models\User::create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'hr',
            'service' => 'Human Resources'
        ]);

        // Create a Manager
        $manager = \App\Models\User::create([
            'name' => 'manager',
            'email' => 'manager@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'manager',
            'service' => 'Digital Development',
        ]);

        // Create an Employee assigned to that Manager
        \App\Models\User::create([
            'name' => 'employee1',
            'email' => 'employee1@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'employee',
            'service' => 'Digital Development',
        ]);
    }
}

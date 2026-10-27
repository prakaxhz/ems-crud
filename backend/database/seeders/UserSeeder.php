<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed admin user credentials.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@creativebees.com',
                'password' => Hash::make('Admin@123'),
            ],
            [
                'name' => 'HR Manager',
                'email' => 'hr@creativebees.com',
                'password' => Hash::make('Hr@123456'),
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }
    }
}


<?php

// database/seeders/PositionSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        Position::insert([
            ['name' => 'Staff'],
            ['name' => 'Asst Manager'],
            ['name' => 'Manager'],
        ]);
    }
}

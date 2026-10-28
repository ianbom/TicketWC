<?php

// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            SubDepartmentSeeder::class,
            LocationSeeder::class,
            PositionSeeder::class,
            CategorySeeder::class,
        ]);
    }
}

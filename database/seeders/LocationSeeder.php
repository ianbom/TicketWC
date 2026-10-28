<?php

// database/seeders/LocationSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gateway;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Gateway::insert([
            ['code' => 'GW01', 'name' => 'Batam'],
            ['code' => 'GW02', 'name' => 'Cikarang'],
            ['code' => 'GW03', 'name' => 'Pontianak'],
            ['code' => 'GW04', 'name' => 'Banjarmasin'],
            ['code' => 'GW05', 'name' => 'Tarakan'],
            ['code' => 'GW06', 'name' => 'Manado'],
            ['code' => 'GW07', 'name' => 'Kupang'],
            ['code' => 'GW08', 'name' => 'Ambon'],
            ['code' => 'GW09', 'name' => 'Manokwari'],
            ['code' => 'GW10', 'name' => 'Timika'],
            ['code' => 'GW11', 'name' => 'Jayapura'],
        ]);
    }
}

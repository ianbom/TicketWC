<?php

// database/seeders/SubDepartmentSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubDepartment;
use App\Models\Department;

class SubDepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $gsmDept  = Department::where('name', 'GAR Site Management')->first();
        $uomDept  = Department::where('name', 'GAR UOM')->first();

        SubDepartment::insert([
            [
                'department_id' => optional($gsmDept)->id,
                'name' => 'GSM',
            ],
            [
                'department_id' => optional($uomDept)->id,
                'name' => 'Site Support',
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Gateway;
use App\Models\Position;
use App\Models\SubDepartment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $subDepartment = SubDepartment::with('department')->orderBy('id')->first();
        $gateway = Gateway::orderBy('id')->first();
        $position = Position::orderBy('id')->first();

        if (! $subDepartment?->department || ! $gateway || ! $position) {
            throw new RuntimeException('Lengkapi data master department, subdepartment, gateway, dan position sebelum menjalankan UserSeeder.');
        }

        foreach (['admin' => 'Admin Lokal', 'user' => 'User Lokal'] as $role => $name) {
            $user = User::firstOrNew(['email' => $role.'@ticketing.test']);

            if (! $user->exists) {
                $user->fill([
                    'name' => $name,
                    'password' => Hash::make('Password123!'),
                    'department_id' => $subDepartment->department_id,
                    'sub_department_id' => $subDepartment->id,
                    'gateway_id' => $gateway->id,
                    'position_id' => $position->id,
                ]);
            }

            $user->role = $role;
            $user->email_verified_at ??= now();
            $user->save();
        }
    }
}

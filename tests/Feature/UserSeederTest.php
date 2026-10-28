<?php

namespace Tests\Feature;

use App\Models\Gateway;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\PositionSeeder;
use Database\Seeders\SubDepartmentSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class UserSeederTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $connection = DB::connection();

        if (! $this->app->environment('testing')
            || $connection->getDriverName() !== 'mysql'
            || ! str_starts_with($connection->getDatabaseName(), 'ticketing_seeder_test_')) {
            $this->markTestSkipped('Use an isolated MySQL database named ticketing_seeder_test_* with migrations applied.');
        }

        $connection->beginTransaction();
        $this->beforeApplicationDestroyed(fn () => $connection->rollBack());
    }

    public function test_database_seeder_creates_verified_accounts_for_every_role(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(2, User::count());

        foreach (['admin', 'user'] as $role) {
            $user = User::where('email', $role.'@ticketing.test')->firstOrFail();

            $this->assertSame($role, $user->role);
            $this->assertNotNull($user->email_verified_at);
            $this->assertTrue(Hash::check('Password123!', $user->password));
            $this->assertNotNull($user->department);
            $this->assertNotNull($user->subDepartment);
            $this->assertNotNull($user->gateway);
            $this->assertNotNull($user->position);
            $this->assertSame($user->department_id, $user->subDepartment->department_id);
        }
    }

    public function test_reseeding_preserves_existing_passwords_and_verification_dates(): void
    {
        $this->seed(DatabaseSeeder::class);
        $user = User::where('email', 'admin@ticketing.test')->firstOrFail();
        $user->password = Hash::make('ChangedPassword456!');
        $user->email_verified_at = now()->subDay();
        $user->save();
        $password = $user->password;
        $verifiedAt = $user->email_verified_at->toDateTimeString();

        $this->seed(UserSeeder::class);
        $this->seed(UserSeeder::class);

        $this->assertSame(2, User::count());
        $this->assertSame($password, $user->fresh()->password);
        $this->assertSame($verifiedAt, $user->fresh()->email_verified_at->toDateTimeString());
    }

    public function test_existing_seed_account_is_verified_without_changing_unrelated_users(): void
    {
        $this->seed([
            DepartmentSeeder::class,
            SubDepartmentSeeder::class,
            LocationSeeder::class,
            PositionSeeder::class,
        ]);
        $account = User::factory()->unverified()->create([
            'email' => 'admin@ticketing.test',
            'role' => 'user',
        ]);
        $password = $account->password;
        $unrelated = User::factory()->unverified()->create();
        $original = $unrelated->fresh()->getAttributes();

        $this->seed(UserSeeder::class);

        $this->assertSame('admin', $account->fresh()->role);
        $this->assertNotNull($account->fresh()->email_verified_at);
        $this->assertSame($password, $account->fresh()->password);
        $this->assertSame($original, $unrelated->fresh()->getAttributes());
        $this->assertSame(3, User::count());
    }

    public function test_missing_master_data_fails_before_creating_accounts(): void
    {
        $this->seed([
            DepartmentSeeder::class,
            SubDepartmentSeeder::class,
            LocationSeeder::class,
            PositionSeeder::class,
        ]);
        Gateway::query()->delete();

        try {
            $this->seed(UserSeeder::class);
            $this->fail('Missing master data must reject user seeding.');
        } catch (RuntimeException $exception) {
            $this->assertStringContainsString('data master', $exception->getMessage());
        }

        $this->assertSame(0, User::count());
    }

    public function test_non_local_environments_do_not_create_or_change_accounts(): void
    {
        $account = User::factory()->unverified()->create([
            'email' => 'admin@ticketing.test',
            'role' => 'user',
        ]);
        $original = $account->fresh()->getAttributes();

        foreach (['production', 'staging'] as $environment) {
            $this->app->instance('env', $environment);
            $this->app->make(UserSeeder::class)->run();

            $this->assertSame(1, User::count());
            $this->assertSame($original, $account->fresh()->getAttributes());
        }
    }
}

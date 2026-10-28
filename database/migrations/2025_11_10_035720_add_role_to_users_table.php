<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cek satu per satu sebelum menambahkan
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['admin', 'user'])
                    ->default('user')
                    ->after('password');
            });
        }

        if (!Schema::hasColumn('users', 'department')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('department')->nullable()->after('role');
            });
        }

        if (!Schema::hasColumn('users', 'sub_department')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('sub_department')->nullable()->after('department');
            });
        }

        if (!Schema::hasColumn('users', 'location')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('location')->nullable()->after('sub_department');
            });
        }

        if (!Schema::hasColumn('users', 'position')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('position')->nullable()->after('location');
            });
        }
    }

    public function down(): void
    {
        // Drop kolom hanya jika ada
        $columns = [
            'role',
            'department',
            'sub_department',
            'location',
            'position',
        ];

        foreach ($columns as $col) {
            if (Schema::hasColumn('users', $col)) {
                Schema::table('users', function (Blueprint $table) use ($col) {
                    $table->dropColumn($col);
                });
            }
        }
    }
};

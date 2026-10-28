<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = ['department', 'sub_department', 'location', 'position'];
        $existing = array_filter($columns, fn($col) => Schema::hasColumn('users', $col));

        if (!empty($existing)) {
            Schema::table('users', function (Blueprint $table) use ($existing) {
                $table->dropColumn(array_values($existing));
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('department')->nullable();
            $table->string('sub_department')->nullable();
            $table->string('location')->nullable();
            $table->string('position')->nullable();
        });
    }
};

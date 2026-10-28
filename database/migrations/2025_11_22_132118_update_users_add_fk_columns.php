<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            if (Schema::hasColumn('users', 'department')) {
                $table->dropColumn('department');
            }

            if (Schema::hasColumn('users', 'sub_department')) {
                $table->dropColumn('sub_department');
            }

            if (Schema::hasColumn('users', 'location')) {
                $table->dropColumn('location');
            }

            if (Schema::hasColumn('users', 'position')) {
                $table->dropColumn('position');
            }
        });
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

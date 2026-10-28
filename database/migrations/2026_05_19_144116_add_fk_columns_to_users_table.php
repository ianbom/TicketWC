<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'department_id')) {
                $table->unsignedBigInteger('department_id')->nullable()->after('role');
                $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            }

            if (!Schema::hasColumn('users', 'sub_department_id')) {
                $table->unsignedBigInteger('sub_department_id')->nullable()->after('department_id');
                $table->foreign('sub_department_id')->references('id')->on('sub_departments')->nullOnDelete();
            }

            if (!Schema::hasColumn('users', 'gateway_id')) {
                $table->unsignedBigInteger('gateway_id')->nullable()->after('sub_department_id');
                $table->foreign('gateway_id')->references('id')->on('gateways')->nullOnDelete();
            }

            if (!Schema::hasColumn('users', 'position_id')) {
                $table->unsignedBigInteger('position_id')->nullable()->after('gateway_id');
                $table->foreign('position_id')->references('id')->on('positions')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['sub_department_id']);
            $table->dropForeign(['gateway_id']);
            $table->dropForeign(['position_id']);

            $table->dropColumn(['department_id', 'sub_department_id', 'gateway_id', 'position_id']);
        });
    }
};

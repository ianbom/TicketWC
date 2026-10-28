<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        $columns = ['category', 'sub_category', 'old_category', 'old_subcategory'];
        $existing = array_filter($columns, fn($col) => Schema::hasColumn('tickets', $col));

        if (!empty($existing)) {
            Schema::table('tickets', function (Blueprint $table) use ($existing) {
                $table->dropColumn(array_values($existing));
            });
        }
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->string('sub_category')->nullable();
            $table->string('old_category')->nullable();
            $table->string('old_subcategory')->nullable();
        });
    }
};

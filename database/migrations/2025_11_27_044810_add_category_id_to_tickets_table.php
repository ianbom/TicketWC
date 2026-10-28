<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {

            // Tambahkan kolom baru (boleh null dulu)
            $table->unsignedBigInteger('category_id')->nullable()->after('start_date');
            $table->unsignedBigInteger('sub_category_id')->nullable()->after('category_id');

            // Backup category lama (OPTIONAL tapi aman)
            // $table->string('old_category')->nullable()->after('category');
            // $table->string('old_subcategory')->nullable()->after('sub_category');
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'category_id',
                'sub_category_id',
                // 'old_category',
                // 'old_subcategory'
            ]);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            // ubah kolom status jadi ENUM
            $table->enum('status', ['open', 'progress', 'update', 'hold', 'closed'])
                  ->default('open')
                  ->change();
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('status')->default('open')->change();
        });
    }
};

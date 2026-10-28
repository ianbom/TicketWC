<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_instructions', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('sub_category')->nullable();
            $table->string('description')->nullable();
            $table->string('tags')->nullable();
            $table->string('file_path');
            $table->unsignedBigInteger('uploaded_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_instructions');
    }
};

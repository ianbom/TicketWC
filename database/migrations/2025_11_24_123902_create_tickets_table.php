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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // Auto Generate Ticket Number
            $table->string('ticket_number')->unique();

            // Relasi User & Gateway
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('gateway_id')->nullable();

            // Start Date
            $table->dateTime('start_date');

            // Kategori
            $table->string('category');
            $table->string('sub_category')->nullable();

            // Serial Number
            $table->string('serial_number')->nullable();

            // Flag
            $table->string('flag');

            // Form Tambahan
            $table->string('alarm')->nullable();
            $table->string('indication')->nullable();
            $table->string('action')->nullable();

            // Description
            $table->text('description')->nullable();

            // Status Ticket
            $table->string('status')->default('open');

            $table->timestamps();

            // Foreign Keys
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('gateway_id')->references('id')->on('gateways')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

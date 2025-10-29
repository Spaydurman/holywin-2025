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
        Schema::create('side_quest_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('header_id');
            $table->string('input_type');
            $table->string('placeholder')->nullable();
            $table->boolean('is_question')->default(false);
            $table->string('answer')->nullable();
            $table->string('validation_rule')->nullable();
            $table->integer('points')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('side_quest_lines');
    }
};
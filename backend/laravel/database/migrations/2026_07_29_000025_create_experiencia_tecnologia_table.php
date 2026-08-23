<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiencia_tecnologia', function (Blueprint $table) {
            $table->foreignId('experiencia_id')->constrained('experiencias')->cascadeOnDelete();
            $table->foreignId('tecnologia_id')->constrained('tecnologias')->cascadeOnDelete();
            $table->primary(['experiencia_id', 'tecnologia_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiencia_tecnologia');
    }
};

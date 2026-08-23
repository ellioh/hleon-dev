<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Resultados como lista estructurada {metrica, valor, descripcion} en vez
// de texto libre, para renderizar "stat cards" automáticamente.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyecto_resultados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->cascadeOnDelete();
            $table->string('metrica', 120);
            $table->string('valor', 60);
            $table->string('descripcion', 200)->nullable();
            $table->integer('orden')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proyecto_resultados');
    }
};

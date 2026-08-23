<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Galería ordenada polimórfica: reemplaza el patrón "proyecto_galeria"
// específico por uno reutilizable directamente por Post/Servicio cuando
// se implementen, sin migración nueva (ver ADR 0006).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_galeria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->string('galeriable_type');
            $table->unsignedBigInteger('galeriable_id');
            $table->integer('orden')->default(0);

            $table->index(['galeriable_type', 'galeriable_id'], 'idx_media_galeria_galeriable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_galeria');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Versiones de CV descargables (ES/EN). La regla "un solo predeterminado
// por idioma" vive en el modelo/servicio, no aquí (ver ADR 0003 original).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('descargas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->enum('idioma', ['es', 'en']);
            $table->foreignId('archivo_media_id')->constrained('media');
            $table->string('version', 20);
            $table->boolean('es_predeterminado')->default(false);
            $table->boolean('visible')->default(true);
            $table->unsignedInteger('descargas_contador')->default(0);
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('descargas');
    }
};

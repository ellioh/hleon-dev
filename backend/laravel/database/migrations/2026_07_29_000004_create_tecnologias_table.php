<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Entidad completa, no una relación textual: nombre, slug (filtros por
// URL), logo real (ademas del icono/emoji liviano como fallback),
// categoria, color, sitio web. Responde "con que construyes", distinto
// de Habilidad ("que sabes analizar/liderar").
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tecnologias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 60)->unique();
            $table->string('slug', 70)->unique();
            $table->enum('categoria', ['backend', 'frontend', 'basededatos', 'infraestructura', 'lenguaje', 'herramienta', 'otro']);
            $table->string('icono', 60)->nullable();
            $table->foreignId('logo_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('color_acento', 20)->nullable();
            $table->string('url', 255)->nullable();
            $table->boolean('destacado')->default(false);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tecnologias');
    }
};

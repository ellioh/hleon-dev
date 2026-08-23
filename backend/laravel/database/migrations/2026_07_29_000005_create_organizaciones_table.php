<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Reemplaza "Cliente" por una entidad genérica: una organización puede
// ser cliente de consultoría, empleador (futuro uso en Experiencia vía
// `tipo`), o ambos - evita duplicar el mismo concepto en dos tablas.
//
// La confidencialidad NO vive aquí: sigue siendo una decisión por
// proyecto (`proyectos.es_confidencial`), no una propiedad fija de la
// organización - un mismo cliente puede ser público en un proyecto y
// confidencial en otro. `nombre_publico` cubre el caso de mostrar un
// alias en vez del nombre real cuando SÍ se muestra.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('nombre_publico', 120)->nullable();
            $table->enum('tipo', ['cliente', 'empleador', 'ambos'])->default('cliente');
            $table->foreignId('logo_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('url', 255)->nullable();
            $table->string('rubro', 80)->nullable();
            $table->boolean('destacado')->default(false);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizaciones');
    }
};

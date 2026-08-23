<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Competencias de analista - deliberadamente distinto de "tecnologias".
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habilidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->enum('categoria', ['analisis_arquitectura', 'liderazgo_comunicacion', 'backend', 'frontend', 'datos', 'herramientas', 'idiomas']);
            $table->string('descripcion_breve', 200)->nullable();
            $table->unsignedTinyInteger('nivel_interno')->nullable()->comment('Solo para ordenar internamente, nunca se muestra como barra pública');
            $table->boolean('destacada')->default(false);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habilidades');
    }
};

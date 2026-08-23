<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Taxonomía única compartida por Blog, Proyectos y Servicios - unifica las
// dos listas de categoría divergentes del sistema JSON anterior.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 80);
            $table->string('slug', 90)->unique();
            $table->enum('tipo', ['blog', 'proyecto', 'servicio', 'ambos']);
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};

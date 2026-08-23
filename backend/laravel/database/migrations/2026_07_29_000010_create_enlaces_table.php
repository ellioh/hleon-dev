<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Enlaces de nav/footer/redes sociales. Alcance deliberadamente limitado:
// gestiona QUÉ enlaces existentes se muestran, no crea páginas nuevas.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enlaces', function (Blueprint $table) {
            $table->id();
            $table->string('etiqueta', 60);
            $table->string('url', 255);
            $table->enum('contexto', ['social', 'nav_principal', 'footer']);
            $table->integer('orden')->default(0);
            $table->boolean('visible')->default(true);
            $table->boolean('abre_nueva_pestana')->default(false);
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enlaces');
    }
};

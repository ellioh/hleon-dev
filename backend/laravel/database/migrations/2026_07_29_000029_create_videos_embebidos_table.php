<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Videos embebidos (YouTube/Loom, no archivos subidos - por eso no usan
// `media`). Polimórfica por el mismo motivo que media_galeria: Blog y
// Servicios podrán tener sus propios videos sin una tabla nueva.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos_embebidos', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255);
            $table->string('titulo', 160)->nullable();
            $table->string('embebible_type');
            $table->unsignedBigInteger('embebible_id');
            $table->integer('orden')->default(0);

            $table->index(['embebible_type', 'embebible_id'], 'idx_videos_embebidos_embebible');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos_embebidos');
    }
};

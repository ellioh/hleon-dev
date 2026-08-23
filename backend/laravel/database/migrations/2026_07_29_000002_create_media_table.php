<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Biblioteca única de archivos. `usado_en` (qué registros referencian un
// archivo) se resuelve por consulta en el modelo, no como columna.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('url', 500);
            $table->enum('tipo', ['imagen', 'pdf', 'video_embed']);
            $table->string('alt_text', 200)->nullable();
            $table->unsignedInteger('tamano_bytes')->nullable();
            $table->unsignedInteger('ancho')->nullable();
            $table->unsignedInteger('alto')->nullable();
            $table->foreignId('subido_por')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->timestamp('subido_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};

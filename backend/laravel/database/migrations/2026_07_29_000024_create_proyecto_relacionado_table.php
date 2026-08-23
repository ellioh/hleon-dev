<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Auto-relación no dirigida: una sola fila por par (proyecto_id <
// relacionado_id), el modelo consulta en ambos sentidos.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyecto_relacionado', function (Blueprint $table) {
            $table->foreignId('proyecto_id')->constrained('proyectos')->cascadeOnDelete();
            $table->foreignId('relacionado_id')->constrained('proyectos')->cascadeOnDelete();
            $table->primary(['proyecto_id', 'relacionado_id']);
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE proyecto_relacionado ADD CONSTRAINT chk_proyecto_relacionado_orden CHECK (proyecto_id < relacionado_id)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('proyecto_relacionado');
    }
};

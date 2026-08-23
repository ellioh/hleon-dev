<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Bitácora de solo lectura desde el backoffice - nunca se edita/borra
// manualmente. Candidata a archivado después de 2 años.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditoria', function (Blueprint $table) {
            $table->id();
            $table->string('modulo', 60);
            $table->unsignedBigInteger('entidad_id');
            $table->enum('accion', ['crear', 'editar', 'eliminar', 'publicar', 'despublicar']);
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->json('cambios')->nullable();
            $table->timestamp('fecha')->useCurrent();

            $table->index(['modulo', 'entidad_id'], 'idx_auditoria_modulo');
            $table->index('fecha', 'idx_auditoria_fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria');
    }
};

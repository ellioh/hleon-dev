<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Leads del formulario de contacto, bifurcados por `motivo` (estrategia de
// contenido). `estado` reemplaza el booleano "leido" del sistema anterior
// por un pipeline real de seguimiento.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->enum('motivo', ['proyecto', 'empleo', 'otro']);
            $table->string('nombre', 120);
            $table->string('email', 190);
            $table->text('mensaje');
            $table->string('empresa', 120)->nullable();
            $table->foreignId('tipo_sistema_id')->nullable()->constrained('categorias')->nullOnDelete();
            $table->string('presupuesto', 60)->nullable();
            $table->string('empresa_reclutadora', 120)->nullable();
            $table->string('tipo_rol', 120)->nullable();
            $table->enum('modalidad', ['remoto', 'hibrido', 'presencial'])->nullable();
            $table->string('rango_salarial', 80)->nullable();
            $table->string('url_vacante', 255)->nullable();
            $table->enum('estado', ['nuevo', 'leido', 'respondido', 'archivado'])->default('nuevo');
            $table->text('notas_internas')->nullable();
            $table->string('origen', 160)->nullable();
            $table->timestamp('fecha')->useCurrent();
            $table->timestamp('eliminado_en')->nullable();

            $table->index(['motivo', 'estado'], 'idx_solicitudes_motivo_estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};

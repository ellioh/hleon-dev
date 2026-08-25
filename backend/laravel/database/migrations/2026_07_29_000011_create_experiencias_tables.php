<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Línea de tiempo laboral. El CHECK reproduce la regla ya validada en
// ExperienciaService (Iteración 1): "actual" no puede tener fecha_fin.
//
// rol_en/resumen_en: versión en inglés para /hire-me - nullable a
// propósito, sin traducción completa de descripcion/logros (ver ADR de
// Educación/hire-me). Una experiencia sin estos campos completos
// simplemente no aparece en /hire-me, nunca cae al español como respaldo.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizacion_id')->constrained('organizaciones');
            $table->string('rol', 120);
            $table->string('rol_en', 120)->nullable();
            $table->enum('modalidad', ['remoto', 'presencial', 'hibrido', 'freelance']);
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->boolean('actual')->default(false);
            $table->string('resumen', 300);
            $table->string('resumen_en', 300)->nullable();
            $table->mediumText('descripcion');
            $table->string('ubicacion', 120)->nullable();
            $table->boolean('destacado')->default(false);
            $table->boolean('visible')->default(true);
            $table->integer('orden')->default(0);
            $table->enum('estado_publicacion', ['borrador', 'publicado'])->default('borrador');
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('eliminado_en')->nullable();
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE experiencias ADD CONSTRAINT chk_experiencias_actual_sin_fin CHECK (actual = 0 OR fecha_fin IS NULL)');
        }

        Schema::create('experiencia_logros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experiencia_id')->constrained('experiencias')->cascadeOnDelete();
            $table->string('texto', 300);
            $table->integer('orden')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiencia_logros');
        Schema::dropIfExists('experiencias');
    }
};

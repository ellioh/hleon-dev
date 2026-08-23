<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Corrige el hallazgo de la auditoría técnica sobre testimonios no
// verificables: publicado=1 exige consentimiento_verificado=1, reforzado
// aquí a nivel de base de datos (defensa en profundidad, no la primera
// línea de validación - eso vive en TestimonioService).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_cliente', 120);
            $table->string('rol_cliente', 120);
            $table->foreignId('organizacion_id')->nullable()->constrained('organizaciones')->nullOnDelete();
            $table->string('texto', 500);
            $table->unsignedTinyInteger('calificacion')->nullable();
            $table->foreignId('proyecto_id')->nullable()->constrained('proyectos')->nullOnDelete();
            $table->boolean('consentimiento_verificado')->default(false);
            $table->boolean('publicado')->default(false);
            $table->boolean('destacado')->default(false);
            $table->integer('orden')->default(0);
            $table->date('fecha_recibido')->nullable();
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('eliminado_en')->nullable();
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE testimonios ADD CONSTRAINT chk_testimonios_calificacion CHECK (calificacion IS NULL OR calificacion BETWEEN 1 AND 5)');
            DB::statement('ALTER TABLE testimonios ADD CONSTRAINT chk_testimonios_consentimiento CHECK (publicado = 0 OR consentimiento_verificado = 1)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonios');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('slug', 140)->unique();
            $table->string('icono_emoji', 10)->nullable();
            $table->string('resumen_breve', 150);
            $table->mediumText('descripcion_completa');
            $table->decimal('rango_precio_min', 10, 2)->nullable();
            $table->decimal('rango_precio_max', 10, 2)->nullable();
            $table->enum('moneda', ['USD', 'PEN'])->nullable();
            $table->string('tiempo_estimado', 60)->nullable();
            $table->foreignId('proyecto_ejemplo_id')->nullable()->constrained('proyectos')->nullOnDelete();
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->boolean('visible')->default(true);
            $table->boolean('destacado')->default(false);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('eliminado_en')->nullable();
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE servicios ADD CONSTRAINT chk_servicios_rango_precio CHECK (rango_precio_max IS NULL OR rango_precio_min IS NULL OR rango_precio_max >= rango_precio_min)');
        }

        Schema::create('servicio_entregables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('servicio_id')->constrained('servicios')->cascadeOnDelete();
            $table->string('texto', 200);
            $table->integer('orden')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicio_entregables');
        Schema::dropIfExists('servicios');
    }
};

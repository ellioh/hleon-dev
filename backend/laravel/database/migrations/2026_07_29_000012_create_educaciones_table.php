<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('educaciones', function (Blueprint $table) {
            $table->id();
            $table->string('institucion', 160);
            $table->string('titulo', 160);
            $table->string('campo_estudio', 120)->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->boolean('en_curso')->default(false);
            $table->text('descripcion')->nullable();
            $table->boolean('visible')->default(true);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('eliminado_en')->nullable();
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE educaciones ADD CONSTRAINT chk_educaciones_en_curso_sin_fin CHECK (en_curso = 0 OR fecha_fin IS NULL)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('educaciones');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Singleton: mensaje y fork del home. hero_estadisticas es 1-N y vive en
// la misma migración por ser parte indivisible de la misma funcionalidad.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero', function (Blueprint $table) {
            $table->id();
            $table->string('headline', 160);
            $table->text('subheadline');
            $table->string('fork_empresa_titulo', 120);
            $table->string('fork_empresa_descripcion', 240);
            $table->string('fork_empresa_cta_label', 60);
            $table->string('fork_empresa_cta_url', 255);
            $table->string('fork_reclutador_titulo', 120);
            $table->string('fork_reclutador_descripcion', 240);
            $table->string('fork_reclutador_cta_label', 60);
            $table->string('fork_reclutador_cta_url', 255);
            $table->string('cta_final_titulo', 160)->nullable();
            $table->text('cta_final_descripcion')->nullable();
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('hero_estadisticas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hero_id')->constrained('hero')->cascadeOnDelete();
            $table->string('numero', 20);
            $table->string('etiqueta', 80);
            $table->integer('orden')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_estadisticas');
        Schema::dropIfExists('hero');
    }
};

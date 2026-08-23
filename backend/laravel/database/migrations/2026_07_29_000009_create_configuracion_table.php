<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Singleton: SEO global y feature flags de sitio completo. Los campos SEO
// de contenido (meta_titulo, meta_descripcion, og_image) viven embebidos
// en cada módulo (proyectos, posts, servicios) - ver ADR "SEO embebido".
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_sitio', 80);
            $table->string('titulo_template', 80);
            $table->string('descripcion_default', 200);
            $table->foreignId('imagen_og_default_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('dominio_base', 120);
            $table->string('analytics_id', 60)->nullable();
            $table->string('google_search_console', 120)->nullable();
            $table->mediumText('textos_legales')->nullable();
            $table->json('feature_flags')->nullable();
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion');
    }
};

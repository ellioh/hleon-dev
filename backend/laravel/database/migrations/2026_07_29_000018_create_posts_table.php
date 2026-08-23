<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// tipo_audiencia determina el CTA dinámico de la estrategia de contenido.
// autor referencia perfil (no un string fijo) para no romper nada si en
// el futuro hay coautoría. SEO vive en `seo_metadata` (polimórfica,
// migración 000027), no aquí - por eso no hay meta_descripcion propia.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 180);
            $table->string('slug', 200)->unique();
            $table->string('resumen', 300);
            $table->mediumText('contenido');
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->enum('tipo_audiencia', ['consultoria', 'carrera_arquitectura', 'ambos'])->default('ambos');
            $table->json('tags')->nullable();
            $table->foreignId('imagen_destacada_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('autor_id')->constrained('perfil');
            $table->boolean('publicado')->default(false);
            $table->dateTime('fecha_publicacion');
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('eliminado_en')->nullable();

            $table->index('publicado', 'idx_posts_publicado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

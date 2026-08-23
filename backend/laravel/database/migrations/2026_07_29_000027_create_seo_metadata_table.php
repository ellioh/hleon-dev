<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabla polimórfica única de SEO - meta título/descripción, canonical,
// indexación (robots), Open Graph y Twitter Cards. Un solo modelo
// Eloquent y un solo componente de formulario sirven a Proyecto, y
// después a Post y Servicio, sin repetir estas ~12 columnas en cada
// tabla de contenido (ver ADR 0006, "Project como arquitectura de
// referencia").
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('seo_optionable_type');
            $table->unsignedBigInteger('seo_optionable_id');

            $table->string('meta_titulo', 160)->nullable();
            $table->string('meta_descripcion', 160)->nullable();
            $table->string('canonical_url', 255)->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);

            $table->string('og_titulo', 160)->nullable();
            $table->string('og_descripcion', 200)->nullable();
            $table->foreignId('og_imagen_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('og_tipo', 40)->default('website');

            $table->enum('twitter_card', ['summary', 'summary_large_image'])->default('summary_large_image');
            $table->string('twitter_titulo', 160)->nullable();
            $table->string('twitter_descripcion', 200)->nullable();
            $table->foreignId('twitter_imagen_id')->nullable()->constrained('media')->nullOnDelete();

            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['seo_optionable_type', 'seo_optionable_id'], 'uq_seo_optionable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_metadata');
    }
};

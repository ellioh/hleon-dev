<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// El case study completo - módulo más complejo del CMS y arquitectura de
// referencia del resto (ver ADR 0006). Los campos de narrativa
// (el_desafio/la_solucion/mi_rol) son obligatorios a propósito: el
// formulario mismo enseña la estructura editorial correcta.
//
// SEO vive en la tabla polimórfica `seo_metadata` (migración 000027), no
// aquí. Galería y videos embebidos viven en `media_galeria` y
// `videos_embebidos` (polimórficas, migraciones 000028/000029) - se
// eliminó `proyecto_galeria`/`proyecto_videos` para que Blog y Servicios
// puedan reutilizar exactamente el mismo patrón sin una migración nueva.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 160);
            $table->string('slug', 180)->unique();
            $table->string('resumen_ejecutivo', 220);
            $table->foreignId('organizacion_id')->nullable()->constrained('organizaciones')->nullOnDelete();
            $table->boolean('es_confidencial')->default(false);
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->enum('estado', ['en_curso', 'completado', 'mantenimiento', 'archivado']);
            // Nullable: proyectos migrados de antes de este esquema pueden
            // no tener esta info registrada (p.ej. si el trabajo fue
            // remoto o presencial) - no se inventa. El formulario de
            // creación sí la exige para proyectos nuevos.
            $table->enum('modalidad', ['remoto', 'presencial', 'hibrido'])->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->mediumText('el_desafio');
            $table->mediumText('la_solucion');
            $table->mediumText('mi_rol');
            $table->mediumText('arquitectura')->nullable();
            $table->mediumText('retos')->nullable();
            $table->mediumText('aprendizajes')->nullable();
            $table->foreignId('imagen_principal_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('url_publica', 255)->nullable();
            $table->boolean('destacado')->default(false);
            $table->integer('orden')->default(0);
            $table->boolean('visible')->default(true);
            $table->enum('estado_publicacion', ['borrador', 'publicado'])->default('borrador');
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('eliminado_en')->nullable();

            $table->index('destacado', 'idx_proyectos_destacado');
            $table->index('estado_publicacion', 'idx_proyectos_estado_publicacion');
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE proyectos ADD CONSTRAINT chk_proyectos_fechas CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};

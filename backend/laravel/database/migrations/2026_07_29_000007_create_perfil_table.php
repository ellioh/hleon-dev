<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Singleton: fuente única de identidad, contacto y disponibilidad. La fila
// única se garantiza a nivel de aplicación (PerfilService en el futuro
// modelo Eloquent), no con una restricción de base de datos.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfil', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo', 160);
            $table->string('nombre_publico', 160)->nullable();
            $table->string('titulo_profesional', 160);
            $table->string('bio_corta', 200);
            $table->mediumText('bio_larga');
            $table->foreignId('foto_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('email', 190);
            $table->string('ubicacion', 120);
            $table->enum('nivel_ingles', ['basico', 'intermedio', 'avanzado', 'profesional', 'nativo']);
            $table->enum('disponibilidad', ['abierto_remoto', 'abierto_proyectos', 'abierto_ambos', 'no_disponible']);
            $table->string('mensaje_disponibilidad', 200)->nullable();
            $table->unsignedTinyInteger('anos_experiencia');
            $table->foreignId('cv_general_id')->nullable()->constrained('descargas')->nullOnDelete();
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('actualizado_en')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfil');
    }
};
